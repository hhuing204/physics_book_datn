function normalizeBlueprintVariablesForClient(value = {}) {
    const result = {}

    const entries = value instanceof Map ? Array.from(value.entries()) : Object.entries(value)

    for (const [key, item] of entries) {
        if (Array.isArray(item)) {
            result[key] = item
            continue
        }

        if (item && typeof item === 'object' && 'options' in item) {
            result[key] = Array.isArray(item.options) ? item.options : []
            continue
        }

        if (item && typeof item === 'object' && ('min' in item || 'max' in item || 'type' in item)) {
            result[key] = item
            continue
        }

        result[key] = []
    }

    return result
}

function normalizeBlueprintVariablesForStorage(value = {}) {
    const result = {}

    for (const [key, item] of Object.entries(value)) {
        if (Array.isArray(item)) {
            result[key] = item
        } else if (item && typeof item === 'object' && 'options' in item) {
            result[key] = Array.isArray(item.options) ? item.options : []
        } else if (item && typeof item === 'object' && ('min' in item || 'max' in item || 'type' in item)) {
            result[key] = item
        } else {
            result[key] = []
        }
    }

    return result
}

module.exports = {
    normalizeBlueprintVariablesForClient,
    normalizeBlueprintVariablesForStorage
}
