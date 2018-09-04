// Store classes to be applied depending on
// which button-container is hovered
const buttonCircleClasses = new Map();
buttonCircleClasses.set("topleft", {
  topright: "down-right",
  bottomleft: "down-right",
  bottomright: "up-left"
});
buttonCircleClasses.set("topright", {
  topleft: "down-left",
  bottomleft: "up-right",
  bottomright: "down-left"
});
buttonCircleClasses.set("bottomleft", {
  topleft: "up-right",
  topright: "down-left",
  bottomright: "up-right"
});
buttonCircleClasses.set("bottomright", {
  topleft: "down-right",
  topright: "up-left",
  bottomleft: "up-left"
});


// Get ref to nav
const nav = document.getElementById('navbar');

// Attach listeners
// .nav__button listeners
let navButtons = Array.from(
  document.querySelectorAll(".nav__button")
);

navButtons.forEach(button => {
  button.addEventListener("mouseenter", handleMouseEnter);
  button.addEventListener("focus", handleFocus);
  button.addEventListener("mouseleave", handleMouseLeave);
  button.addEventListener("blur",handleBlur);
  button.addEventListener('click',handleClick);
});

// .nav__button-heading listeners
let navButtonHeadings = Array.from(document.querySelectorAll('.nav__button-heading'));

navButtonHeadings.forEach(heading => {
  heading.addEventListener('mouseleave', handleMouseLeave);
  heading.addEventListener('click',handleClick);
})


// Add behavior for when button and (subsequently) button-heading are hovered OR focused
function handleMouseEnter(e) {
  handleMouseEnterOrFocus(e);
}

function handleFocus(e) {
  handleMouseEnterOrFocus(e);
}

function handleMouseEnterOrFocus(e) {
  // unhighlight any previously highlighted nav__item
  // NOTE: This is necessary because the previously 
  // highlighted nav__item might have been highlighted
  // via different method (viz, focus vs. hover)
  if (nav.classList.contains('nav--highlighted')) {
    let highlightedNavItem = nav.querySelector('.nav__item--highlighted');    
    
    if (e.target.closest('.nav__item') !== highlightedNavItem) {
      console.log('calling removeAllHighlights()');
      removeAllHighlights();
    }
  }
        
  let navItem = e.target.closest(".nav__item");

  if (nav.classList.contains("nav--centered")) {
    // Highlight nav
    nav.classList.add("nav--highlighted");
    navItem.classList.add("nav__item--highlighted");

    // Modify unhighlighted button positions
    let location = e.target.closest('.nav__item').dataset.location;
    let classesToAdd = buttonCircleClasses.get(location);
    
    for (let target in classesToAdd) {
      let targetButton = document.querySelector(
      '[data-location="' + target + '"] .nav__button-circle');
      
      targetButton.classList.add(classesToAdd[target]);
    }
    
  } else if (nav.classList.contains("nav--docked")) {
    // TODO: Apply appropriate button sizing changes
    // (no positioning changes here)
    // Highlight nav and appropriate nav__item
    nav.classList.add('nav--highlighted');
    navItem.classList.add('nav__item--highlighted');
  }
}


function handleMouseLeave(e) {
  let currentNavItem = document.elementFromPoint(e.pageX, e.pageY).parentElement;
  let previousNavItem = e.target.closest('.nav__item');
  
  // bail if we're still in the same nav__item
  // OR  the nav__item left was not highlighted
  if ((currentNavItem && currentNavItem === previousNavItem) ||
     (!previousNavItem.classList.contains('nav__item--highlighted') )) return;
  
  if (nav.classList.contains('nav--centered')) {
    // Return button circles to initial size
    nav.classList.remove('nav--highlighted');
    previousNavItem.classList.remove('nav__item--highlighted');

    // Return button circles to initial positions
    let location = e.target.closest('.nav__item').dataset.location;
    let classesToAdd = buttonCircleClasses.get(location);

    for (let target in classesToAdd) {
      let targetButton = document.querySelector(
      '[data-location="' + target + '"] .nav__button-circle');

      targetButton.classList.remove(classesToAdd[target]);
    }
  } else if (nav.classList.contains('nav--docked')) {
    // TODO: implement button behavior when nav is docked
  }
}

function handleBlur(e) {
  if (nav.classList.contains('nav--centered')) {
    removeAllHighlights();
  } else if (nav.classList.contains('nav--docked')) {
    // TODO: implement button behavior when nav is docked
  }
}

function removeAllHighlights() {
  nav.classList.remove('nav--highlighted');
  
  let highlightedItem = nav.querySelector('.nav__item--highlighted');
  
  if (highlightedItem) {
    // remove highlights
    highlightedItem.classList.remove('nav__item--highlighted');
    
    // remove  positioning changes on circles
    let location = highlightedItem.dataset.location;
    let classesToRemove = buttonCircleClasses.get(location);

    for (let target in classesToRemove) {
      let targetButton = document.querySelector(
      '[data-location="' + target + '"] .nav__button-circle');

      targetButton.classList.remove(classesToRemove[target]);
    }
  } else {
    console.log('\tnothing to remove');
  }
}


function handleClick(e) {
  console.log('click from',e.target.closest('.nav__item').dataset.location);
  // remove --selected from any currently selected nav item
  let currentlySelected = document.querySelector('.nav__item--selected');
  if (currentlySelected) {
    currentlySelected.classList.remove('nav__item--selected');
  }
  
  // apply --selected to newly selected nav item
  e.target.closest('.nav__item').classList.add('nav__item--selected');
  
  // apply appropriate changes if we're moving nav from centered to docked
  if (nav.classList.contains('nav--centered')) {
    removeAllHighlights();
    dockNavbar();
  }
}

function dockNavbar() {
  nav.classList.remove('nav--centered');
  nav.classList.add('nav--docked');
}