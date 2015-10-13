Schema = {};
Schema.RegEx = {};

Schema.RegEx.activityCode = /^([A-Z]{2})$/;
Schema.RegEx.phoneNumber = /^(\+0?1\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/;
Schema.RegEx.inventoryCode = /^([A-Z]{2})\-([A-Z]{2})\-(\d{2})$/; // Inventory code format 'WM-EL-04' (two uppercase letters)-(two more)-(two numbers)

SimpleSchema.messages({
  "regEx": [
    {exp: Schema.RegEx.inventoryCode, msg: "Code does not follow format AA-BB-##"}
  ]
})