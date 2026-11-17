//Fonctions utilitaires pour la pagination
//Exemple : GET /api/proprietes?page=2&limit=5

export const getPagination = (req) => {
    const page = Math.max(parseInt(req.query.page) || 1, 1)
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100)
    const offset = (page - 1) * limit
    return { page, limit, offset }
}

//Reponse paginee a partir du resultat de findAndCountAll
export const pagedResponse = ({ count, rows }, page, limit) => ({
    data: rows,
    pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
    }
})
