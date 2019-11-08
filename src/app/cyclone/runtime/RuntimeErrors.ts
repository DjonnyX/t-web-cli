enum RuntimeErrors {
  NATIVE_ELEMENT_IS_NOT_DEFINED = "Native element is not defined.",
  WRONG_TEMPLATE = "Wrong template",
  REQUESTED_CLASS_NOT_EXPORTED = "Requested class not exported",
  MODULE_IS_NOT_DEFINED = "Cyclone module is not defined",
  EVENT_TYPE_MUST_BE_DEFINED = "eventType must be defined.",
  PROPERTY__S__IS_NOT_DEFINED_OF__O_ = 'Property $s is not defined of "$o"',
  EVENT_HANDLER__E__IS_NOT_EXISTS = 'Event handler $h is not defined',
  EXECUTOR_FOR_EVENTTYPE__T__IS_NOT_FOUND = 'Executor for eventType $t is not found',
}
export default RuntimeErrors;
