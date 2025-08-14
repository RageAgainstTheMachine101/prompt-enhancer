// Script to create base64 encoded icons for the extension
// Run this in a browser console to generate the icon data URIs

function createIcon(size) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    const center = size / 2;
    const radius = size * 0.4;
    
    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    
    // Background circle
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, 2 * Math.PI);
    ctx.fill();
    
    // White border
    ctx.strokeStyle = 'white';
    ctx.lineWidth = Math.max(1, size / 32);
    ctx.stroke();
    
    // Main star
    ctx.fillStyle = 'white';
    ctx.globalAlpha = 0.95;
    drawStar(ctx, center, center, radius * 0.6, radius * 0.3, 4);
    
    // Small accent stars for larger sizes
    if (size >= 48) {
        ctx.globalAlpha = 0.7;
        drawStar(ctx, center + radius * 0.6, center - radius * 0.6, radius * 0.15, radius * 0.08, 4);
        drawStar(ctx, center - radius * 0.6, center + radius * 0.6, radius * 0.15, radius * 0.08, 4);
    }
    
    return canvas.toDataURL('image/png');
}

function drawStar(ctx, x, y, outerRadius, innerRadius, points) {
    ctx.beginPath();
    let angle = -Math.PI / 2;
    const angleStep = Math.PI / points;
    
    for (let i = 0; i < points * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const px = x + Math.cos(angle) * radius;
        const py = y + Math.sin(angle) * radius;
        
        if (i === 0) {
            ctx.moveTo(px, py);
        } else {
            ctx.lineTo(px, py);
        }
        
        angle += angleStep;
    }
    
    ctx.closePath();
    ctx.fill();
}

// Generate icons and log data URIs
console.log('16x16 Icon:', createIcon(16));
console.log('48x48 Icon:', createIcon(48));
console.log('128x128 Icon:', createIcon(128));