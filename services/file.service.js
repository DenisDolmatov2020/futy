const { v4: uuidv4 } = require('uuid');
const path = require('node:path');

class FileService {
    saveFile(file) {
        try {
            const fileName = uuidv4() + '.jpg';
            const filePath = path.resolve('static', fileName);
            file.mv(filePath);
            return fileName;
        } catch (e) {
            console.log(e)
        }
    }
}

module.exports = new FileService();