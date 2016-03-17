# Local fork for meteor-autoform-materialize by lwli1991

Forked from:

https://github.com/djhi/meteor-autoform-materialize/

* components/afarrayfield/afarrayfield.html (add/remove icons and alignments)
* components/quickform/quickform.html (submit button text and right alignment)
* components/afobjectfield/afobjectfield.html (removed card title and some styling, removed card-panel class)
* inputtypes/boolean-radios/boolean-radios.html (converted true/false label `this` to triple braces)
* inputtypes/switch/switch.html (converted true/false label `this` to triple braces)
* components/quickform/quickform.html (added material save icon to atts.buttonContent block)
* components/pickadate/pickadate.js (comment out `else {picker.set('clear');}` so that picker persists across invalid submission) https://github.com/djhi/meteor-autoform-materialize/pull/85
* inputtypes/select-checkbox/select-checkbox.html/js (added a toggler and its event handler)
* inputtypes/select-checkbox-inline/select-checkbox-inline.html/js (added a toggler and its event handler also changed the overall style of checkboxes to inline-blocks)
* inputtypes/textarea/textarea.js (remove characterCounter() call from the onrendered block)
* components/afformgroup/afformgroup.js (comment out boolean-checkbox)
* https://github.com/djhi/meteor-autoform-materialize/commit/28729996210a239896989843f4a075dd4cedc5ed
* https://github.com/djhi/meteor-autoform-materialize/pull/75/files
