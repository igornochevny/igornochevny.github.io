/**
 * Created by Igor on 24.08.2017.
 */

"use strict";

let addressBook = function (_options) {
    debugger;

        let entryTemplate =
            '   <div class="col-md-4 phone">' +
            '   </div>' +
            '   <div class="col-md-3 firstname">' +
            '   </div>' +
            '   <div class="col-md-3 lastname">' +
            '   </div>' +
            '   <div class="col-md-2">' +
            '       <button type="button" class="btn btn-info detail-button" title="Details information">' +
            '           <i class="fa fa-address-card-o" aria-hidden="true"></i>' +
            '       </button>' +
            '       <div class="btn-group">' +
            '           <button type="button" class="btn btn-primary edit-button" title="Edit entry">' +
            '               <i class="fa fa-pencil-square-o" aria-hidden="true"></i>' +
            '           </button>' +
            '           <button type="button" class="btn btn-danger delete-button" title="Delete entry">' +
            '               <i class="fa fa-minus" aria-hidden="true"></i>' +
            '           </button>' +
            '        </div>' +
            '   </div>';

        let options;

        let Book;

        let doc = document, addEntryBtn, formCancelBtn, inputForm, inputFormContainer, entriesContainer, infoForm,
            infoFormContainer, infoFormCancelBtn;


        let defOptions = {
            addEntryBtn: '.add-button',
            formCancelBtn: '.cancel-button',
            infoFormCancelBtn: '.info-cancel-button',
            inputForm: '.input-form',
            inputFormContainer: '.input-form-container',
            infoForm: '.info-form',
            infoFormContainer: '.info-form-container',
            entriesContainer: '.entries-container',
            entryEditButton: '.edit-button',
            entryDeleteButton: '.delete-button',
            entryDetailButton: '.detail-button'
        };

        let editedRow = undefined;

        let formFunctions = {

            clearForm: function (form) {
                form.removeAttribute('data-index');
                form.classList.remove("was-validated");
                form.reset();

                return formFunctions;
            },

            formToggleDisplay: function (elements) {

                let toggleElementDisplay = function (element) {
                    element.style.display = (element.style.display === "none" || element.style.display === "" || element.style.display === undefined ? "block" : "none");
                };

                elements.forEach(function (item) {
                    typeof item === 'object' && toggleElementDisplay(item);
                });

                return formFunctions;
            },

            clearEditForm: function () {
                editedRow = undefined;
                return formFunctions.clearForm(inputForm);
            },

            clearInfoForm: function () {

                return formFunctions.clearForm(infoForm);
            },

            editFormToggleDisplay: function () {
                let elements = [inputFormContainer];

                return formFunctions.formToggleDisplay(elements);
            },

            infoFormToggleDisplay: function () {
                let elements = [infoFormContainer];

                return formFunctions.formToggleDisplay(elements);
            }
        };

        let eventHandlers = {

            formCancelBtn: function (ev) {
                ev.preventDefault();
                formFunctions
                    .editFormToggleDisplay()
                    .clearEditForm();

                return true;
            },

            infoFormCancelBtn: function (ev) {
                ev.preventDefault();
                formFunctions
                    .infoFormToggleDisplay()
                    .clearInfoForm();
                return true;
            },

            addEntryBtn: function (ev) {
                ev.preventDefault();

                formFunctions.editFormToggleDisplay();

                return true;
            },

            inputFormSubmit: function (ev) {
                let idx = -1;
                ev.preventDefault();
                if (this.checkValidity() !== false) {
                    let entry = utilityFunctions.FormToObject(inputForm);
                    if (!entry.isEmpty()) {
                        inputForm.dataset.isEmpty() && (idx = Book.push(entry) - 1);
                        inputForm.dataset.isEmpty() || (Book[idx = inputForm.dataset.index] = entry);
                    }
                    localStorage['addressBook'] = JSON.stringify(Book);
                    idx < 0 || utilityFunctions.showEntry(entry, idx, editedRow);
                    idx < 0 || (Book[idx]['idx'] = idx);

                    formFunctions
                        .editFormToggleDisplay()
                        .clearEditForm();

                    return true;
                }
                this.classList.add("was-validated");

                return false;
            },

            entryEditButton: function (ev) {
                ev.preventDefault();
                editedRow = this.parentNode.offsetParent.parentNode;
                let idx = editedRow.dataset.index;
                let item = Book[idx];
                Object.keys(item).forEach(function (key) {
                    inputForm.querySelector('[name=' + key + ']') && (inputForm.querySelector('[name=' + key + ']').value = item[key]);
                });
                inputForm.dataset.index = idx;
                formFunctions.editFormToggleDisplay();

                return true;
            },

            entryDetailButton: function (ev) {
                ev.preventDefault();
                let idx = this.offsetParent.parentNode.dataset.index;
                //let item = utilityFunctions.getBooksItemByIdx(Book, idx);
                let item = Book[idx];
                Object.keys(item).forEach(function (key) {
                    infoForm.querySelector('[name=' + key + ']') && (infoForm.querySelector('[name=' + key + ']').value = item[key]);
                });
                inputForm.dataset.index = idx;
                formFunctions.infoFormToggleDisplay();

                return true;
            },

            entryDeleteButton: function (ev) {
                ev.preventDefault();
                let quest = confirm("Are you sure that you want to delete permanently this contact?");
                if (quest === true) {
                    let container = this.parentNode.offsetParent.parentNode;
                    let idx = container.dataset.index;
                    Book.splice(idx, 1);
                    localStorage['addressBook'] = JSON.stringify(Book);
                    entriesContainer.removeChild(container);
                }

                return false;
            }

        };

        let utilityFunctions = {

            getBooksItemByIdx: function (Arr, idx) {
                let res = undefined;
                if (Arr) {
                    res = Arr.filter(function (item) {
                        return item['idx'] === idx;
                    });
                    res.length > 0 && (res = res[0]);
                }

                return res;
            },

            FormToObject: function (form) {
                let obj = {};
                let elements = form.elements;
                Object.keys(elements).forEach(function (item) {
                    /\D+/.test(item) && form.hasOwnProperty(item) && (obj[item] = elements[item].value);
                });

                return obj;
            },

            initHandlers: function () {
                addEntryBtn === undefined || addEntryBtn.addEventListener('click', eventHandlers.addEntryBtn);
                formCancelBtn === undefined || formCancelBtn.addEventListener('click', eventHandlers.formCancelBtn);
                infoFormCancelBtn === undefined || infoFormCancelBtn.addEventListener('click', eventHandlers.infoFormCancelBtn);
                inputForm === undefined || inputForm.addEventListener('submit', eventHandlers.inputFormSubmit);

                return utilityFunctions;
            },

            setEntryHandlers: function (item) {
                item === undefined ||
                item.querySelector(options.entryEditButton).addEventListener('click', eventHandlers.entryEditButton);
                item.querySelector(options.entryDetailButton).addEventListener('click', eventHandlers.entryDetailButton);
                item.querySelector(options.entryDeleteButton).addEventListener('click', eventHandlers.entryDeleteButton);
                // item.querySelector().addEventListener('click', eventHandlers.quickAddBtn);

                return utilityFunctions;
            },

            showEntry: function (item, index, replaceElement = undefined) {
                let entry = doc.createElement('div');
                entry.innerHTML = entryTemplate;
                entry.classList.add('row', 'entry');
                entry.dataset.index = index;
                Object.keys(item).forEach(function (key) {
                    entry.querySelector('.' + key) && (entry.querySelector('.' + key).innerText = item[key]);
                });

                (replaceElement === undefined) && entriesContainer.appendChild(entry);
                replaceElement === undefined || entriesContainer.replaceChild(entry, replaceElement);

                return utilityFunctions.setEntryHandlers(entry);
            },

            getSearchElements: function () {
                let searchPhrase = doc.querySelector('input[name=search]').value;
                let SearchElements = Book;
                if (typeof searchPhrase === 'string' && searchPhrase.length > 0) {
                    SearchElements = Book.filter(
                        function(item){
                            // togo regexp conditions checking
                            return true;
                        }
                    );
                }

                return SearchElements;
            },

            showEntries: function () {
                let SearchBook = utilityFunctions.getSearchElements();
                    SearchBook && SearchBook.length && SearchBook.forEach(function (item, index) {
                    utilityFunctions.showEntry(item, index);
                });

                return utilityFunctions;
            },

            clearEntriesContainer: function () {
                while (entriesContainer.firstChild) {
                    entriesContainer.removeChild(entriesContainer.firstChild);
                }
            }

        };

        let pub = {
            init: function () {
                options = Object.assign({}, _options, defOptions);

                addEntryBtn = doc.querySelector(options.addEntryBtn);
                formCancelBtn = doc.querySelector(options.formCancelBtn);
                infoFormCancelBtn = doc.querySelector(options.infoFormCancelBtn);
                inputFormContainer = doc.querySelector(options.inputFormContainer);
                inputForm = doc.querySelector(options.inputForm);
                entriesContainer = doc.querySelector(options.entriesContainer);
                infoFormContainer = doc.querySelector(options.infoFormContainer);
                infoForm = doc.querySelector(options.infoForm);

                Book = JSON.parse(localStorage.getItem('addressBook')) || [];

                utilityFunctions
                    .initHandlers()
                    .showEntries();

                return pub;
            }
        };

        Object.prototype.isEmpty = function () {
            for (let key in this) {
                if (this.hasOwnProperty(key)) {

                    return false;
                }
            }

            return true;
        };

        return pub.init();
    }
;