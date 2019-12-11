// Создание textarea для ввода markdown (готовая библиотека)
var markDownEditor = CodeMirror.fromTextArea(document.getElementById("codeMarkDown"), {
  lineNumbers: true, // Нумеровать каждую строчку.
  matchBrackets: true,
  mode: "markdown",
  htmlMode: true,
  indentUnit: 4, // Длина отступа в пробелах.
  theme: "yonce",
  lineWrapping: true
});

// Создание textarea для ввода html (готовая библиотека)
var htmlEditor = CodeMirror.fromTextArea(document.getElementById("codeHtml"), {
  lineNumbers: true, // Нумеровать каждую строчку.
  matchBrackets: true,
  mode: "xml",
  htmlMode: true,
  indentUnit: 4, // Длина отступа в пробелах.
  theme: "yonce",
  readOnly: true,
  lineWrapping: true,
  cursorBlinkRate: -1
});


// Изменение текста на markdown редакторе
// -> появляется текст в box-result
htmlEditor.on("change", function(evt){
  document.getElementById("result").innerHTML = htmlEditor.getValue();
});


// текст, который вводится на markdown редакторе,
// появлеяется в html редакторе
markDownEditor.on("change", function(evt){
  var converter = new showdown.Converter();
  htmlEditor.setValue(converter.makeHtml(markDownEditor.getValue()));
});


var btnExportMarkdown = document.getElementById("btn-export-markdown");
// Экспорт текста из textarea markDownEditor в файл по клику
btnExportMarkdown.addEventListener("click", function () {
  //"Достаём текст из textarea markDownEditor"a в переменную"

  var textToWrite = markDownEditor.getValue();
  // Проверка на пустоту. Если ничего, кроме пробелов нет,
  // то нечего и скачивать! Логично же.
  if(textToWrite.trim() === ""){
    alert("К сожалению, нечего экпортировать.");
    return;
  }//if

  // Создаем объект Blob. Blob представляет из себя объект наподобие файла
  // с неизменяемыми, необработанными данными.у
  var textFileAsBlob = new Blob([ textToWrite ], { type: "text/plain" });
  // Название файла, который будем скачивать
  var fileNameToSaveAs = "text.md";

  var downloadLink = document.createElement("a");
  downloadLink.download = fileNameToSaveAs;
  downloadLink.innerHTML = "Download File";
  // Работа над кроссбраузерностью
  if (window.webkitURL != null) {
    // Chrome позволяет щелкнуть ссылку, фактически не добавляя ее в DOM
    downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
  } else {
    // Firefox требует, чтобы ссылка была добавлена в DOM, прежде чем ее можно будет щелкнуть
    downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
    downloadLink.onclick = destroyClickedElement;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
  } // if

  downloadLink.click();
});


var btnExportHtml = document.getElementById("btn-export-html");
// Экспорт текста из textarea markDownEditor в файл по клику
btnExportHtml.addEventListener("click", function () {
  //"Достаём текст из textarea htmlEditor"a в переменную"

  var textToWrite = htmlEditor.getValue();
  // Проверка на пустоту. Если ничего, кроме пробелов нет,
  // то нечего и скачивать! Логично же.
  if(textToWrite.trim() === ""){
    alert("К сожалению, нечего экпортировать.");
    return;
  }//if

  // Создаем объект Blob. Blob представляет из себя объект наподобие файла
  // с неизменяемыми, необработанными данными.
  var textFileAsBlob = new Blob([ textToWrite ], { type: "text/plain" });
  // Название файла, который будем скачивать
  var fileNameToSaveAs = "text.html";

  var downloadLink = document.createElement("a");
  downloadLink.download = fileNameToSaveAs;
  downloadLink.innerHTML = "Download File";
  // Работа над кроссбраузерностью
  if (window.webkitURL != null) {
    // Chrome позволяет щелкнуть ссылку, фактически не добавляя ее в DOM
    downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
  } else {
    // Firefox требует, чтобы ссылка была добавлена в DOM, прежде чем ее можно будет щелкнуть
    downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
    downloadLink.onclick = destroyClickedElement;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
  } // if

  downloadLink.click();
});

// удаляет ссылку из DOM'a
function destroyClickedElement(evt) {
  document.body.removeChild(evt.target);
}


// Очистка экрана на markdown editor'e
var btnCleanMarkdown = document.getElementById("btn-clean-markdown");
btnCleanMarkdown.addEventListener("click", function () {
  markDownEditor.setValue("");
});


// 1) имитация клика по input'у, который доступно скрыт
// 2) реализация импорта файла
var btnImportMarkdown = document.getElementById("btn-import-markdown");
var inputFile = document.getElementById("input-file");
btnImportMarkdown.addEventListener("click", function () {
  // имитация клика по input'у
  inputFile.click();
});

// Событие изменение пути файла в input-file (click тут не подходит)
inputFile.addEventListener("change", function(evt) {
  readFile(evt.srcElement.files[0]);
});

// читаем файл и выводим на markdowneditor
function readFile(file) {
  var reader = new FileReader();
  reader.onload = readSuccess;
  function readSuccess(evt) {
    markDownEditor.setValue(evt.target.result);
  };
  reader.readAsText(file);
}//readFile


// Добавление ссылки
var btnLinkMarkdown = document.getElementById("btn-link-markdown");
var linkModal = document.querySelector(".add-link");
var linkModalClose = document.getElementById("add-link-close");
var linkModalOk = document.getElementById("add-link-ok");
var linkInput = document.getElementById("input-link");

// клик по кнопке "добавить ссылку" (на markdown панеле)
btnLinkMarkdown.addEventListener("click", function (evt) {
  evt.preventDefault();
  linkModal.classList.add("add-link-show");
  linkInput.value = "";   // обнуляем предидущее значение
  linkInput.focus();      // ставим сразу фокус
});

// Обработка закрытия popup'a добавения ссылки.
linkModalClose.addEventListener("click", function (evt) {
  evt.preventDefault();
  linkModal.classList.remove("add-link-show");
  linkModal.classList.remove("add-link-error");
});

// Обработка клика кнопки ОК.
// Добавление сгенерированной ссылки в markDownEditor
// (причём в то место, где был курсор)
linkModalOk.addEventListener("click", function (evt) {
  if(!linkInput.value){
    evt.preventDefault();
    linkModal.classList.remove("add-link-error");
    linkModal.offsetWidth = linkModal.offsetWidth; // трюк для работы анимации
    linkModal.classList.add("add-link-error");
    return;
  }//if

  // сгенерированная ссылка
  var str = "[enter link description here](" + linkInput.value + ")";

  // вставка в необходимое место
  var doc = markDownEditor.getDoc();
  var cursor = doc.getCursor();
  doc.replaceRange(str, cursor);

  // закрываем popup
  linkModal.classList.remove("add-link-show");
});

// Обработка нажатия клавиши ESC при открытом popup'e
window.addEventListener("keydown", function (evt) {
  if (evt.keyCode !== 27)
    return;

  evt.preventDefault();
  if (linkModal.classList.contains("add-link-show")) {
    linkModal.classList.remove("add-link-show");
    linkModal.classList.remove("add-link-error");
  }//if
});

// Обработка нажатия клавиши ENTER при открытом popup'e
window.addEventListener("keydown", function (evt) {
  if (!linkModal.classList.contains("add-link-show") || evt.keyCode !== 13)
    return;

  evt.preventDefault();
  linkModalOk.click();
});


// Добавление изображения
var btnImgMarkdown = document.getElementById("btn-img-markdown");
var imgModal = document.querySelector(".add-img");
var imgModalClose = document.getElementById("add-img-close");
var imgModalOk = document.getElementById("add-img-ok");
var imgInput = document.getElementById("input-img");

// клик по кнопке "добавить изображение" (на markdown панеле)
btnImgMarkdown.addEventListener("click", function (evt) {
  evt.preventDefault();
  imgModal.classList.add("add-img-show");
  imgInput.value = "";   // обнуляем предидущее значение
  imgInput.focus();      // ставим сразу фокус
});

// Обработка закрытия popup'a добавения изображения.
imgModalClose.addEventListener("click", function (evt) {
  evt.preventDefault();
  imgModal.classList.remove("add-img-show");
  imgModal.classList.remove("add-img-error");
});

// Обработка клика кнопки ОК.
// Добавление сгенерированного изображения в markDownEditor
// (причём в то место, где был курсор)
imgModalOk.addEventListener("click", function (evt) {
  if(!imgInput.value){
    evt.preventDefault();
    imgModal.classList.remove("add-img-error");
    imgModal.offsetWidth = imgModal.offsetWidth; // трюк для работы анимации
    imgModal.classList.add("add-img-error");
    return;
  }//if

  // сгенерированное изображение
  var str = "![enter img description here](" + imgInput.value + ")";

  // вставка в необходимое место
  var doc = markDownEditor.getDoc();
  var cursor = doc.getCursor();
  doc.replaceRange(str, cursor);

  // закрываем popup
  imgModal.classList.remove("add-img-show");
});

// Обработка нажатия клавиши ESC при открытом popup'e
window.addEventListener("keydown", function (evt) {
  if (evt.keyCode !== 27)
    return;

  evt.preventDefault();
  if (imgModal.classList.contains("add-img-show")) {
    imgModal.classList.remove("add-img-show");
    imgModal.classList.remove("add-img-error");
  }
});

// Обработка нажатия клавиши ENTER при открытом popup'e
window.addEventListener("keydown", function (evt) {
  if (!imgModal.classList.contains("add-img-show") || evt.keyCode !== 13)
    return;

  evt.preventDefault();
  imgModalOk.click();
});


// popup Контакты
var linkContacts = document.querySelector(".link-contacts");
var contactsModal = document.querySelector(".contacts");
var contactsModalClose = document.getElementById("contacts-close");

// клик по ссылке в меню
linkContacts.addEventListener("click", function (evt) {
  evt.preventDefault();
  contactsModal.classList.add("contacts-show");
});

// Обработка закрытия popup'a добавения изображения.
contactsModalClose.addEventListener("click", function (evt) {
  evt.preventDefault();
  contactsModal.classList.remove("contacts-show");
});

// Обработка нажатия клавиши ESC при открытом popup'e
window.addEventListener("keydown", function (evt) {
  if (!contactsModal.classList.contains("contacts-show") || evt.keyCode !== 27)
    return;

  evt.preventDefault();
  contactsModalClose.click();
});

// Работа с localstorage
// при выходе с приложения сохраняем текст, который был на markdown редакторе
window.onbeforeunload = function(evt) {
  localStorage.setItem("markdownText", markDownEditor.getValue());
};

// загрузка данных из localstorage при старте работы приложения
document.addEventListener("DOMContentLoaded", function () {
  markDownEditor.setValue(localStorage.getItem("markdownText"));
});


// Да, быдло-код. Ну а что поделать :(
// Выбор режима отображения прогарммы
var mode1 = document.querySelector(".view__ul--1");
var mode2 = document.querySelector(".view__ul--2");
var mode3 = document.querySelector(".view__ul--3");

var boxResult = document.getElementById("boxResult");
var boxHtml = document.getElementById("boxHtml");
var boxMarkdown = document.getElementById("boxMarkdown");
var handler1 = document.getElementById("handler1");
var handler2 = document.getElementById("handler2");

var mods = [mode1, mode2, mode3];

// Функция отмечает текущий элемент списка.
var setCurrentMode = function(mods, num){
  // проходим все элементы списка и удаляем класс "current"
  mods.forEach(function(mod){
    if (mod.classList.contains("current"))
      mod.classList.remove("current");
  });

  // необходимому пунку добавляем класс "current"
  mods[num - 1].classList.add("current");
};

// 1) клик по пункту режим "Редактор и превью" (2 окна)
mode1.addEventListener("click", function (evt) {
  evt.preventDefault();
  setCurrentMode(mods, 1);

  if(handler2.classList.contains("visually-hidden"))
    handler2.classList.remove("visually-hidden");

  if(boxResult.classList.contains("visually-hidden"))
    boxResult.classList.remove("visually-hidden");

  if(!handler1.classList.contains("visually-hidden"))
    handler1.classList.add("visually-hidden");

  if(!boxHtml.classList.contains("visually-hidden"))
    boxHtml.classList.add("visually-hidden");

  boxMarkdown.style.width = "50%";
  boxResult.style.width = "50%";
  boxMarkdown.style.height = "auto"
});

// 2) клик по пункту режим "Только редактор markdown" (1 окно)
mode2.addEventListener("click", function (evt) {
  evt.preventDefault();
  setCurrentMode(mods, 2);

  if(!handler1.classList.contains("visually-hidden"))
    handler1.classList.add("visually-hidden");

  if(!handler2.classList.contains("visually-hidden"))
    handler2.classList.add("visually-hidden");

  if(!boxHtml.classList.contains("visually-hidden"))
    boxHtml.classList.add("visually-hidden");

  if(!boxResult.classList.contains("visually-hidden"))
    boxResult.classList.add("visually-hidden");

  boxMarkdown.style.width = "100%";
  boxMarkdown.style.height = "100vh";
});

// 3) клик по пункту режим "Предпросмотр HTML" (3 окна)
mode3.addEventListener("click", function (evt) {
  evt.preventDefault();
  setCurrentMode(mods, 3);

  if(boxHtml.classList.contains("visually-hidden"))
    boxHtml.classList.remove("visually-hidden");

  if(boxResult.classList.contains("visually-hidden"))
    boxResult.classList.remove("visually-hidden");

  if(handler1.classList.contains("visually-hidden"))
    handler1.classList.remove("visually-hidden");

  if(handler2.classList.contains("visually-hidden"))
    handler2.classList.remove("visually-hidden");

  boxMarkdown.style.width = "33%";
  boxResult.style.width = "33%";
  boxHtml.style.width = "33%";
  boxMarkdown.style.height = "auto"
});



// document.addEventListener("click", function(evt) {
//   do {
//     if (evt.target == contactsModal) {
//       // если клик внутри contacts popup - ничего не делаем
//       return;
//     }
//     // Go up the DOM
//     evt.target = evt.target.parentNode;
//   } while (evt.target);
//
//   // Это клик снаружи. Закрываем окно
//   contactsModalClose.click();
// });

// Ненужный код. Работа с динамическим перераспределением места в box"aх.
// Но пусть будет.)))

// // Работа с динамической шириной контейнеров на главной странице
// var handler = document.querySelector(".handler");
// var wrapper = handler.closest(".wrapper");
// var boxA = wrapper.querySelector(".box");
// var isHandlerDragging = false;
//
// document.addEventListener("mousedown", function(e) {
//   // If mousedown event is fired from .handler, toggle flag to true
//   if (e.target === handler) {
//     isHandlerDragging = true;
//   }
// });
//
// document.addEventListener("mousemove", function(e) {
//   // Don"t do anything if dragging flag is false
//   if (!isHandlerDragging) {
//     return false;
//   }
//
//   // Get offset
//   var containerOffsetLeft = wrapper.offsetLeft;
//
//   // Get x-coordinate of pointer relative to container
//   var pointerRelativeXpos = e.clientX - containerOffsetLeft;
//
//   // Arbitrary minimum width set on box A, otherwise its inner content will collapse to width of 0
//   var boxAminWidth = 60;
//
//   // Resize box A
//   // * 8px is the left/right spacing between .handler and its inner pseudo-element
//   // * Set flex-grow to 0 to prevent it from growing
//   boxA.style.width = (Math.max(boxAminWidth, pointerRelativeXpos - 8)) + "px";
//   boxA.style.flexGrow = 0;
// });
//
// document.addEventListener("mouseup", function(e) {
//   // Turn off dragging flag when user mouse is up
//   isHandlerDragging = false;
// });
