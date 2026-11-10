import AVFoundation
import AppKit

// macOS system exporter. Originals are read only; export preserves full duration and audio.
let root = URL(fileURLWithPath: FileManager.default.currentDirectoryPath)
let input = root.appendingPathComponent("source-assets/videos/grooming")
let output = root.appendingPathComponent("public/videos/grooming")
let posters = root.appendingPathComponent("source-assets/generated/grooming-posters")
for folder in [output, posters] {
  try FileManager.default.createDirectory(at: folder, withIntermediateDirectories: true)
}
var records: [[String: Any]] = []
for url in try FileManager.default.contentsOfDirectory(at: input, includingPropertiesForKeys: nil).sorted(by: { $0.lastPathComponent < $1.lastPathComponent }) where url.pathExtension.lowercased() == "mov" {
  let asset = AVURLAsset(url: url)
  let name = url.deletingPathExtension().lastPathComponent.lowercased()
  let destination = output.appendingPathComponent(name + "-v1.mp4")
  if !FileManager.default.fileExists(atPath: destination.path) {
    guard let exporter = AVAssetExportSession(asset: asset, presetName: AVAssetExportPreset960x540) else { fatalError("Export unavailable: \(name)") }
    exporter.outputURL = destination
    exporter.outputFileType = .mp4
    exporter.shouldOptimizeForNetworkUse = true
    let completion = DispatchSemaphore(value: 0)
    exporter.exportAsynchronously { completion.signal() }
    completion.wait()
    guard exporter.status == .completed else { fatalError("Export failed: \(String(describing: exporter.error))") }
  }
  let generator = AVAssetImageGenerator(asset: asset)
  generator.appliesPreferredTrackTransform = true
  generator.maximumSize = CGSize(width: 768, height: 1366)
  let cg = try generator.copyCGImage(at: CMTime(seconds: min(2, asset.duration.seconds / 3), preferredTimescale: 600), actualTime: nil)
  let rep = NSBitmapImageRep(cgImage: cg)
  try rep.representation(using: .jpeg, properties: [.compressionFactor: 0.95])!.write(to: posters.appendingPathComponent(name + ".jpg"))
  let exported = AVURLAsset(url: destination)
  let track = exported.tracks(withMediaType: .video).first!
  let size = track.naturalSize.applying(track.preferredTransform)
  records.append([
    "id": name,
    "source": "source-assets/videos/grooming/" + url.lastPathComponent,
    "src": "videos/grooming/" + name + "-v1.mp4",
    "duration": asset.duration.seconds,
    "exportDuration": exported.duration.seconds,
    "width": Int(abs(size.width)), "height": Int(abs(size.height)),
    "bytes": try destination.resourceValues(forKeys: [.fileSizeKey]).fileSize!,
    "originalBytes": try url.resourceValues(forKeys: [.fileSizeKey]).fileSize!
  ])
  print("Exported \(name)")
  fflush(stdout)
}
try JSONSerialization.data(withJSONObject: records, options: [.prettyPrinted, .sortedKeys]).write(to: root.appendingPathComponent("source-assets/grooming-videos.manifest.json"))
