const glob = require("glob");
const path = require("path");
const { writeFile, readFile } = require("fs");

const INSERT = "/ script was here /\n\n";

const writingFile = file => (err, data) => {
  if (!data.includes(INSERT)) {
    writeFile(file, `${INSERT}${data}`, err => {
      if (err) throw err;
      console.log("Текст был добавлен");
    });
  }
};

const readingFile = directory => file => {
  const filee = path.resolve(__dirname, `${directory}/${file}`);
  readFile(filee, "utf8", writingFile(filee));
};

const iterableFiles = ({ files, directory }) => {
  files.forEach(readingFile(directory));
};

const getFilesByPattern = (
  path = __dirname,
  search = "**/*.{js,css,txt}",
  ignore = ["**/*.js"]
) =>
  new Promise((resolve, reject) => {
    glob(
      search,
      {
        cwd: path,
        ignore
      },
      (err, files) => {
        if (err) {
          reject(err);
        }

        resolve({ files, directory: path });
      }
    );
  });

getFilesByPattern("src")
  .then(iterableFiles)
  .catch(err => {
    throw err;
  })
  .finally(() => console.log("Writed completed"));

// Необходимо реализовать скрипт на nodejs который на вход принимает 3 параметра:
// path - путь к директории
// search - шаблон поиска в формате glob ( например: src/**/*.js )
// ignore - необязательный параметр, путь к файлу содержащему список шаблонов в формате glob (.gitignore, .eslintignore)

// Задача скрипта:

// Найти по указанному path все файлы отвечающие шаблону search, игнорируя пути из параметра ignore, если он передан.
// В каждый из найденных файлов добавить в начало строку "/ script was here /\n\n”.
// Если в файле уже присутствует данная строка, файл игнорируется.
