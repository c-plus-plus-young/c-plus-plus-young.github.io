# Requires cwebp to be installed and in PATH
# You can install it via chocolatey: choco install webp
$categories = @(
    "favorites",
    "for-sale",
    "wildlife",
    "portraits",
    "landscape",
    "automotive",
    "game-boy",
    "architecture",
    "macro",
    "paleontology"
)

foreach ($category in $categories) {
    $inputPath = "assets/images/$category"
    if (Test-Path $inputPath) {
        Get-ChildItem "$inputPath/*.jpg" | ForEach-Object {
            $outputFile = $_.FullName -replace '\.jpg$', '.webp'
            cwebp -q 85 -resize 500 500 $_.FullName -o $outputFile
        }
    }
}