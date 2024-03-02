import { SpeakersList } from './SpeakersList.js';
import { WarningsList } from './WarningsList.js';
const screenWidth = window.screen.width;
const screenHeight = window.screen.height;
const availWidth = window.screen.availWidth;
const availHeight = window.screen.availHeight;
console.log(`${availWidth}, ${availHeight} / ${screenWidth}, ${screenHeight}`);
window.resizeTo(screenWidth / 2, screenHeight / 2);
const speakersList = new SpeakersList();
const verbalWarningsList = new WarningsList();
const writtenWarningsList = new WarningsList();
// List handlers
const selectListItem = (ev, listName) => {
    const listGroup = document.querySelector(`#${listName}-list-group`);
    let isTargetTheActiveItem = false;
    let target = ev.target;
    // To handle the case where the user clicks the badge. We want the parent li.
    if (target.tagName === 'SPAN') {
        target = target.parentElement;
    }
    const isLi = (target.tagName == 'LI');
    if (isLi) {
        const activeItem = document.querySelector(`#${listName}-list-group li.active`);
        activeItem === null || activeItem === void 0 ? void 0 : activeItem.classList.remove('active');
        // If the clicked item is already selected, deselect it
        isTargetTheActiveItem = (target == activeItem);
        if (isTargetTheActiveItem) {
            renderList(listName);
        }
        else {
            target.classList.add('active');
            renderList(listName, Array.from(listGroup.children).indexOf(target));
            listNamesAndSuffixes.map((elem) => { if (elem[0] !== listName) {
                renderList(elem[0]);
            } });
        }
    }
    else {
        renderList(listName);
    }
};
const renderList = (listName, activeIndex) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const listSuffix = listName === 'speakers' ? 'sl' : listName === 'verbal-warnings' ? 'vwl' : 'wwl';
    const list = listName === 'speakers' ? speakersList.getList() : listName === 'verbal-warnings' ? verbalWarningsList.getList() : writtenWarningsList.getList();
    const listGroup = document.querySelector(`#${listName}-list-group`);
    listGroup.innerHTML = '';
    let index = 0;
    for (const delegation of list) {
        const item = document.createElement('li');
        item.classList.add('list-group-item', 'list-group-item-action');
        // If the list is the verbal or written warnings list, add a badge with the warning count
        if (listName === 'verbal-warnings' || listName === 'written-warnings') {
            item.textContent = delegation[0] + ' ';
            if (delegation[1] > 1) {
                item.innerHTML += `<span class="badge text-bg-danger rounded-pill">${delegation[1]}</span>`;
            }
        }
        else {
            // If the list is the speakers list, just add the delegation name
            item.textContent = delegation;
        }
        if (activeIndex === index) {
            item.classList.add('active');
        }
        listGroup.appendChild(item);
        index++;
    }
    ;
    // Enable/disable the add button depending on if the input field is empty
    const delegationNameField = document.querySelector(`#name-${listSuffix}`);
    if (delegationNameField.value.trim() === '') {
        document.querySelector(`#add-button-${listSuffix}`).setAttribute('disabled', 'true');
    }
    else {
        document.querySelector(`#add-button-${listSuffix}`).removeAttribute('disabled');
    }
    // Enable/disable the necessary buttons depending on if there's an active item
    if (activeIndex === undefined || activeIndex === null || activeIndex < 0) {
        document.querySelector(`#remove-button-${listSuffix}`).setAttribute('disabled', 'true');
        (_a = document.querySelector(`#increment-warning-button-${listSuffix}`)) === null || _a === void 0 ? void 0 : _a.setAttribute('disabled', 'true');
        (_b = document.querySelector(`#up-button-${listSuffix}`)) === null || _b === void 0 ? void 0 : _b.setAttribute('disabled', 'true');
        (_c = document.querySelector(`#down-button-${listSuffix}`)) === null || _c === void 0 ? void 0 : _c.setAttribute('disabled', 'true');
    }
    else {
        document.querySelector(`#remove-button-${listSuffix}`).removeAttribute('disabled');
        (_d = document.querySelector(`#increment-warning-button-${listSuffix}`)) === null || _d === void 0 ? void 0 : _d.removeAttribute('disabled');
        // Enable/disable the up and down buttons depending on the active item's position
        (_e = document.querySelector(`#up-button-${listSuffix}`)) === null || _e === void 0 ? void 0 : _e.removeAttribute('disabled');
        (_f = document.querySelector(`#down-button-${listSuffix}`)) === null || _f === void 0 ? void 0 : _f.removeAttribute('disabled');
        if (activeIndex === 0) {
            (_g = document.querySelector(`#up-button-${listSuffix}`)) === null || _g === void 0 ? void 0 : _g.setAttribute('disabled', 'true');
        }
        if (activeIndex === listGroup.children.length - 1) {
            (_h = document.querySelector(`#down-button-${listSuffix}`)) === null || _h === void 0 ? void 0 : _h.setAttribute('disabled', 'true');
        }
    }
};
// Speakers list handlers
const addDelegationToSpeakersList = () => {
    const inputElement = document.querySelector('#name-sl');
    const delegationName = inputElement.value.trim();
    if (delegationName == '') {
        return;
    }
    inputElement.value = '';
    speakersList.addDelegation(delegationName);
    renderList('speakers');
    inputElement.focus();
};
const removeDelegationFromSpeakersList = () => {
    const listGroup = document.querySelector('#speakers-list-group');
    const activeItem = document.querySelector('#speakers-list-group li.active');
    const index = Array.from(listGroup.children).indexOf(activeItem);
    if (index === -1) {
        return;
    }
    speakersList.removeDelegation(index);
    listGroup.removeChild(activeItem);
    renderList('speakers');
};
const swapDelegationsInSpeakersList = (swapUp) => {
    const listGroup = document.querySelector('#speakers-list-group');
    const activeItem = document.querySelector('#speakers-list-group li.active');
    const index = Array.from(listGroup.children).indexOf(activeItem);
    const otherIndex = index + (swapUp ? -1 : 1);
    if (otherIndex === -1 || otherIndex === listGroup.children.length) {
        return;
    }
    speakersList.swapDelegations(index, otherIndex);
    renderList('speakers', otherIndex);
};
// Warnings lists handlers
const addDelegationToWarningsList = (listName) => {
    const listSuffix = listName === 'verbal-warnings' ? 'vwl' : 'wwl';
    const list = listName === 'verbal-warnings' ? verbalWarningsList : writtenWarningsList;
    const inputElement = document.querySelector(`#name-${listSuffix}`);
    const delegationName = inputElement.value.trim();
    if (delegationName == '') {
        return;
    }
    inputElement.value = '';
    // Search for the delegation in the warnings list, and if it's already there, don't add it again and increase the count by 1
    if (list.includes(delegationName)) {
        list.increaseWarningByName(delegationName);
    }
    else {
        list.addDelegationByName(delegationName);
    }
    renderList(listName);
    inputElement.focus();
};
const decreaseWarningInWarningsList = (listName) => {
    const list = listName === 'verbal-warnings' ? verbalWarningsList : writtenWarningsList;
    const listGroup = document.querySelector(`#${listName}-list-group`);
    const activeItem = document.querySelector(`#${listName}-list-group li.active`);
    const index = Array.from(listGroup.children).indexOf(activeItem);
    if (index === -1) {
        return;
    }
    // If the warning count reaches 0, remove the delegation from the list
    if (list.getList()[index][1] > 1) {
        list.decreaseWarning(index);
        renderList(listName, index);
    }
    else {
        list.removeDelegation(index);
        renderList(listName);
    }
};
const incrementWarningInWarningsList = (listName) => {
    const listGroup = document.querySelector(`#${listName}-list-group`);
    const activeItem = document.querySelector(`#${listName}-list-group li.active`);
    const list = listName === 'verbal-warnings' ? verbalWarningsList : writtenWarningsList;
    const index = Array.from(listGroup.children).indexOf(activeItem);
    if (index === -1) {
        return;
    }
    list.increaseWarning(index);
    renderList(listName, index);
};
// Speakers list
document.querySelector('#add-button-sl').addEventListener('click', () => addDelegationToSpeakersList());
document.querySelector('#remove-button-sl').addEventListener('click', () => removeDelegationFromSpeakersList());
document.querySelector('#up-button-sl').addEventListener('click', () => swapDelegationsInSpeakersList(true));
document.querySelector('#down-button-sl').addEventListener('click', () => swapDelegationsInSpeakersList(false));
document.querySelector('#speakers-list-group').addEventListener('click', (ev) => selectListItem(ev, 'speakers'));
// Verbal warnings list
document.querySelector('#add-button-vwl').addEventListener('click', () => addDelegationToWarningsList('verbal-warnings'));
document.querySelector('#remove-button-vwl').addEventListener('click', () => decreaseWarningInWarningsList('verbal-warnings'));
document.querySelector('#increment-warning-button-vwl').addEventListener('click', () => incrementWarningInWarningsList('verbal-warnings'));
document.querySelector('#verbal-warnings-list-group').addEventListener('click', (ev) => selectListItem(ev, 'verbal-warnings'));
// Written warnings list
document.querySelector('#add-button-wwl').addEventListener('click', () => addDelegationToWarningsList('written-warnings'));
document.querySelector('#remove-button-wwl').addEventListener('click', () => decreaseWarningInWarningsList('written-warnings'));
document.querySelector('#increment-warning-button-wwl').addEventListener('click', () => incrementWarningInWarningsList('written-warnings'));
document.querySelector('#written-warnings-list-group').addEventListener('click', (ev) => selectListItem(ev, 'written-warnings'));
// Common handlers
const listNamesAndSuffixes = [['speakers', 'sl'], ['verbal-warnings', 'vwl'], ['written-warnings', 'wwl']];
for (const elem of listNamesAndSuffixes) {
    // Deselect the active item when the input field is focused
    document.querySelector(`#name-${elem[1]}`).addEventListener('click', () => {
        renderList(elem[0]);
    });
    // Enable the add button when the input field is not empty
    document.querySelector(`#name-${elem[1]}`).addEventListener('input', () => {
        if (document.querySelector(`#name-${elem[1]}`).value.trim() === '') {
            document.querySelector(`#add-button-${elem[1]}`).setAttribute('disabled', 'true');
        }
        else {
            document.querySelector(`#add-button-${elem[1]}`).removeAttribute('disabled');
        }
    });
    // Auto-press the 'add' button when the enter key is pressed
    document.querySelector(`#name-${elem[1]}`).addEventListener('keypress', (ev) => {
        if (ev.key === 'Enter') {
            document.querySelector(`#add-button-${elem[1]}`).dispatchEvent(new Event('click'));
        }
    });
}
//# sourceMappingURL=index.js.map