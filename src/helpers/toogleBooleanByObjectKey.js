export const toogleBooleanByObjectKey = (object, key) => ({
    ...object,
    [key]: !object[key],
})
