// apps/backend/src/utils/normalizeId.ts

export function normalizeId<T extends Record<string, any>>(doc: T): T & { id: string } {
    if (!doc) return doc as T & { id: string }

    const obj = doc.toJSON ? doc.toJSON({ virtuals: true }) : { ...doc }

    if (obj._id) {
        obj.id = obj._id.toString()
        delete obj._id
    }

    return obj
}

export function normalizeDocs<T extends Record<string, any>>(docs: T[]): (T & { id: string })[] {
    return docs.map(normalizeId)
}
