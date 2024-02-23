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
    // If the clicked item is already selected, unselect it
    if (ev.target.classList.contains('active')) {
        ev.target.classList.remove('active');
        if (listName === 'speakers') {
            document.querySelector('#remove-button-sl').setAttribute('disabled', 'true');
        }
        return;
    }
    const activeItem = document.querySelector(`#${listName}-list-group li.active`);
    activeItem === null || activeItem === void 0 ? void 0 : activeItem.classList.remove('active');
    ev.target.classList.add('active');
    if (listName === 'speakers') {
        document.querySelector('#remove-button-sl').removeAttribute('disabled');
    }
};
const renderList = (listName, activeIndex) => {
    const list = listName === 'speakers' ? speakersList.getList() : listName === 'verbal-warnings' ? verbalWarningsList.getList() : writtenWarningsList.getList();
    const listGroup = document.querySelector(`#${listName}-list-group`);
    listGroup.innerHTML = '';
    let index = 0;
    list.forEach((delegation) => {
        const item = document.createElement('li');
        item.classList.add('list-group-item', 'list-group-item-action');
        item.textContent = delegation;
        if (activeIndex === index) {
            item.classList.add('active');
        }
        listGroup.appendChild(item);
        index++;
    });
};
// Speakers list handlers
const addDelegationToSpeakersList = () => {
    const inputElement = document.querySelector('#name-sl');
    const delegationName = inputElement.value;
    if (delegationName.trim() == '') {
        return;
    }
    inputElement.value = '';
    speakersList.addDelegation(delegationName);
    console.log(speakersList.getList());
    renderList('speakers');
    inputElement.focus();
    document.querySelector('#add-button-sl').setAttribute('disabled', 'true');
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
    document.querySelector('#remove-button-sl').setAttribute('disabled', 'true');
    console.log(speakersList.getList());
};
const swapDelegationsInSpeakersList = (swapUp) => {
    const listGroup = document.querySelector('#speakers-list-group');
    const activeItem = document.querySelector('#speakers-list-group li.active');
    const index = Array.from(listGroup.children).indexOf(activeItem);
    const otherIndex = index + (swapUp ? -1 : 1);
    if (index === -1 || otherIndex === listGroup.children.length) {
        return;
    }
    speakersList.swapDelegations(index, otherIndex);
    renderList('speakers', otherIndex);
};
document.querySelector('#add-button-sl').addEventListener('click', () => addDelegationToSpeakersList());
document.querySelector('#remove-button-sl').addEventListener('click', () => removeDelegationFromSpeakersList());
document.querySelector('#up-button-sl').addEventListener('click', () => swapDelegationsInSpeakersList(true));
document.querySelector('#down-button-sl').addEventListener('click', () => swapDelegationsInSpeakersList(false));
document.querySelector('#speakers-list-group').addEventListener('click', (ev) => selectListItem(ev, 'speakers'));
document.querySelector('#verbal-warnings-list-group').addEventListener('click', (ev) => selectListItem(ev, 'verbal-warnings'));
document.querySelector('#written-warnings-list-group').addEventListener('click', (ev) => selectListItem(ev, 'written-warnings'));
document.querySelector('#name-sl').addEventListener('click', () => {
    var _a;
    (_a = document.querySelector('#speakers-list-group li.active')) === null || _a === void 0 ? void 0 : _a.classList.remove('active');
});
document.querySelector('#name-sl').addEventListener('input', () => {
    if (document.querySelector('#name-sl').value.trim() === '') {
        document.querySelector('#add-button-sl').setAttribute('disabled', 'true');
    }
    else {
        document.querySelector('#add-button-sl').removeAttribute('disabled');
    }
});
document.querySelector('#name-sl').addEventListener('keypress', (ev) => {
    if (ev.key === 'Enter') {
        document.querySelector('#add-button-sl').dispatchEvent(new Event('click'));
    }
});
//# sourceMappingURL=index.js.map