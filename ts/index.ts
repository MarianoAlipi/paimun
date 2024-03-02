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
const writtenWarningsList = new WarningsList()

// List handlers
const selectListItem = (ev: Event, listName: string) => {
    const listGroup = document.querySelector(`#${listName}-list-group`);
    let isTargetTheActiveItem = false;

    let target = ev.target as HTMLElement;
    // To handle the case where the user clicks the badge. We want the parent li.
    if (target.tagName === 'SPAN') {
        target = target.parentElement;
    }
    const isLi = (target.tagName == 'LI');

    if (isLi) {
        const activeItem = document.querySelector(`#${listName}-list-group li.active`);
        activeItem?.classList.remove('active');

        // If the clicked item is already selected, deselect it
        isTargetTheActiveItem = (target == activeItem);
        if (isTargetTheActiveItem) {
            renderList(listName);
        } else {
            target.classList.add('active');
            renderList(listName, Array.from(listGroup.children).indexOf(target));
            listNamesAndSuffixes.map((elem) => { if (elem[0] !== listName) { renderList(elem[0]); }});
        }
    } else {
        renderList(listName);
    }
};

const renderList = (listName: string, activeIndex?: number) => {
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
            if ((delegation as [string, number])[1] > 1) {
                item.innerHTML += `<span class="badge text-bg-danger rounded-pill">${delegation[1]}</span>`;
            }
        } else {
            // If the list is the speakers list, just add the delegation name
            item.textContent = delegation as string;
        }

        if (activeIndex === index) {
            item.classList.add('active');
        }

        listGroup.appendChild(item);
        index++;
    };

    // Enable/disable the add button depending on if the input field is empty
    const delegationNameField = document.querySelector(`#name-${listSuffix}`) as HTMLInputElement;
    if (delegationNameField.value.trim() === '') {
        document.querySelector(`#add-button-${listSuffix}`).setAttribute('disabled', 'true');
    } else {
        document.querySelector(`#add-button-${listSuffix}`).removeAttribute('disabled');
    }

    // Enable/disable the necessary buttons depending on if there's an active item
    if (activeIndex === undefined || activeIndex === null || activeIndex < 0) {
        document.querySelector(`#remove-button-${listSuffix}`).setAttribute('disabled', 'true');
        document.querySelector(`#increment-warning-button-${listSuffix}`)?.setAttribute('disabled', 'true');
        document.querySelector(`#up-button-${listSuffix}`)?.setAttribute('disabled', 'true');
        document.querySelector(`#down-button-${listSuffix}`)?.setAttribute('disabled', 'true');
    } else {
        document.querySelector(`#remove-button-${listSuffix}`).removeAttribute('disabled');
        document.querySelector(`#increment-warning-button-${listSuffix}`)?.removeAttribute('disabled');

        // Enable/disable the up and down buttons depending on the active item's position
        document.querySelector(`#up-button-${listSuffix}`)?.removeAttribute('disabled');
        document.querySelector(`#down-button-${listSuffix}`)?.removeAttribute('disabled');
        if (activeIndex === 0) {
            document.querySelector(`#up-button-${listSuffix}`)?.setAttribute('disabled', 'true');
        }
        if (activeIndex === listGroup.children.length - 1) {
            document.querySelector(`#down-button-${listSuffix}`)?.setAttribute('disabled', 'true');
        }
    }
};

// Speakers list handlers
const addDelegationToSpeakersList = () => {
    
    const inputElement = document.querySelector('#name-sl') as HTMLInputElement;
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

const swapDelegationsInSpeakersList = (swapUp: boolean) => {
    const listGroup = document.querySelector('#speakers-list-group');
    const activeItem = document.querySelector('#speakers-list-group li.active');

    const index = Array.from(listGroup.children).indexOf(activeItem);
    const otherIndex = index + (swapUp ? -1 : 1);

    if (otherIndex === -1 || otherIndex === listGroup.children.length) {
        return;
    }

    speakersList.swapDelegations(index, otherIndex);
    renderList('speakers', otherIndex);
}

// Warnings lists handlers
const addDelegationToWarningsList = (listName: 'verbal-warnings' | 'written-warnings') => {
    
    const listSuffix = listName === 'verbal-warnings' ? 'vwl' : 'wwl';
    const list = listName === 'verbal-warnings' ? verbalWarningsList : writtenWarningsList;

    const inputElement = document.querySelector(`#name-${listSuffix}`) as HTMLInputElement;
    const delegationName = inputElement.value.trim();
    if (delegationName == '') {
        return;
    }

    inputElement.value = '';

    // Search for the delegation in the warnings list, and if it's already there, don't add it again and increase the count by 1
    if (list.includes(delegationName)) {
        list.increaseWarningByName(delegationName);
    } else {
        list.addDelegationByName(delegationName);
    }
    renderList(listName);
    inputElement.focus();
};

const decreaseWarningInWarningsList = (listName: 'verbal-warnings' | 'written-warnings') => {
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
    } else {
        list.removeDelegation(index);
        renderList(listName);
    }
};

const incrementWarningInWarningsList = (listName: 'verbal-warnings' | 'written-warnings') => {
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
    document.querySelector(`#name-${elem[1]}`).addEventListener('click',  () => {
        renderList(elem[0]);
    });

    // Enable the add button when the input field is not empty
    document.querySelector(`#name-${elem[1]}`).addEventListener('input',  () => {
        if ((document.querySelector(`#name-${elem[1]}`) as HTMLInputElement).value.trim() === '') {
            document.querySelector(`#add-button-${elem[1]}`).setAttribute('disabled', 'true');
        } else {
            document.querySelector(`#add-button-${elem[1]}`).removeAttribute('disabled');
        }
    });

    // Auto-press the 'add' button when the enter key is pressed
    document.querySelector(`#name-${elem[1]}`).addEventListener('keypress', (ev) => {
        if ((ev as KeyboardEvent).key === 'Enter') {
            document.querySelector(`#add-button-${elem[1]}`).dispatchEvent(new Event('click'));
        }
    });
}
