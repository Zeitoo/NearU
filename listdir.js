const fs = require("fs");
const path = require("path");

const IGNORE = new Set(["node_modules", "dist", ".git"]);

function printTree(dir, prefix = "") {
    const items = fs.readdirSync(dir, { withFileTypes: true })
        .filter(item => !IGNORE.has(item.name))
        .sort((a, b) => a.name.localeCompare(b.name));

    items.forEach((item, index) => {
        const isLast = index === items.length - 1;
        const pointer = isLast ? "└── " : "├── ";
        const fullPath = path.join(dir, item.name);

        console.log(prefix + pointer + item.name);

        if (item.isDirectory()) {
            const newPrefix = prefix + (isLast ? "    " : "│   ");
            printTree(fullPath, newPrefix);
        }
    });
}

// diretório inicial (onde executas o script)
const startDir = process.argv[2] || process.cwd();

console.log(path.basename(startDir));
printTree(startDir);