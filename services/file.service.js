const { v4: uuidv4 } = require('uuid');
const path = require('node:path');

class FileService {
    saveFiles(files) { // Изменено на saveFiles
        const fileNames = [];
        files.forEach(file => {
            try {
                const fileName = uuidv4() + '.jpg'; // Исправлено на вызов функции
                const filePath = path.resolve('static', fileName);
                file.mv(filePath);
                fileNames.push(fileName);
            } catch (error) {
                console.error(error);
            }
        });
        return fileNames;
    }
}

module.exports = new FileService();
