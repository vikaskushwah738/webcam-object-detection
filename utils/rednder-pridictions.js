export const renderPredictions = (predictions, ctx) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // ✅ Corrected method name

    // Set font styles
    const font = "16px sans-serif"; // ✅ Fixed font name
    ctx.font = font;
    ctx.textBaseline = "top";

    predictions.forEach((prediction) => {
        const [x, y, width, height] = prediction.bbox; // ✅ Access property correctly
        const isPerson = prediction.class === "person";

        // Draw bounding box
        ctx.strokeStyle = isPerson ? "#FF0000" : "#00FFFF";
        ctx.lineWidth = 4;
        ctx.strokeRect(x, y, width, height); // ✅ Corrected method name

        // Fill the bounding box with transparent color
        ctx.fillStyle = `rgba(255, 0, 0, ${isPerson ? 0.2 : 0})`; // ✅ Fixed string interpolation
        ctx.fillRect(x, y, width, height); // ✅ Corrected method name

        // Draw label background before text
        ctx.fillStyle = isPerson ? "#FF0000" : "#00FFFF";
        const textWidth = ctx.measureText(prediction.class).width;
        const textHeight = parseInt(font, 10);
        ctx.fillRect(x, y, textWidth + 4, textHeight + 4); // ✅ Corrected method name

        // Draw text label
        ctx.fillStyle = "#000000";
        ctx.fillText(prediction.class, x + 2, y + 2); // ✅ Adjusted text position for readability
    });
};
