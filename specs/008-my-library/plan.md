# Technical Implementation Plan: SPEC-008 My Library & Dynamic PDF Watermarking

**Module Directory**: `docs/specs/008-my-library`  
**Status**: Approved Technical Plan  
**Target Workflow**: `/speckit.plan`  

---

## 1. Selected Tech Stack & Architecture Choices

* **Backend**: ASP.NET Core 10 Web API (`MyLibraryController.cs`).
* **PDF Watermark Library**: `PdfSharpCore` / `iText7`.
* **Security**: HMAC-SHA256 signed temporary download tokens (5-minute expiry).

---

## 2. Codebase Architecture & Folder Structure

```text
backend/
├── Controllers/MyLibraryController.cs    # Library listing & watermarked PDF download
├── Services/
│   ├── Interfaces/IPdfWatermarkEngine.cs# PDF stamping interface
│   └── Implementations/PdfWatermarkEngine.cs # PdfSharpCore implementation
frontend/
├── src/pages/MyLibraryPage.jsx           # Library UI
```

---

## 3. `PdfWatermarkEngine.cs` Implementation Logic

```csharp
public async Task<byte[]> StampWatermarkAsync(Stream masterPdfStream, string buyerName, string buyerEmail)
{
    using var document = PdfReader.Open(masterPdfStream, PdfDocumentOpenMode.Modify);
    var font = new XFont("Arial", 9, XFontStyle.Italic);
    var brush = new XSolidBrush(XColor.FromArgb(120, 0, 0, 0)); // Semi-transparent grey
    var watermarkText = $"Purchased by: {buyerName} ({buyerEmail}) on Phanilie Music Platform";

    foreach (var page in document.Pages)
    {
        using var gfx = XGraphics.FromPdfPage(page);
        var size = gfx.MeasureString(watermarkText, font);
        var x = (page.Width - size.Width) / 2;
        var y = page.Height - 20; // 20pt from bottom
        gfx.DrawString(watermarkText, font, brush, x, y);
    }

    using var outputStream = new MemoryStream();
    document.Save(outputStream, false);
    return outputStream.ToArray();
}
```

---

## 4. Implementation Roadmap

1. **Step 1**: Implement `IPdfWatermarkEngine` using `PdfSharpCore`.
2. **Step 2**: Build `MyLibraryController` endpoints.
3. **Step 3**: Build `MyLibraryPage` component in React.
4. **Step 4**: Verify PDF watermark output accuracy and signed token expiration.
