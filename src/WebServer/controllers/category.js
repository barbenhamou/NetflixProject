const categoryService = require('../services/category');

// Only show relevant info
const presentCategory = (category) => {
    return {
        id: category._id,
        name: category.name,
        promoted: category.promoted
    };
};

const createCategory = async (req, res) => {
    try {
        const categoryId = await categoryService.createCategory(req.body.name, req.body.promoted);
        res.status(201).set('Location', `/api/categories/${categoryId}`).end();
    } catch (err) {
        res.status(err.statusCode).json({ error: err.message });
    }
};

const getCategories = async (req, res) => {
    try {
        const categories = await categoryService.getCategories();
        res.json(categories.map(presentCategory));
    } catch (err) {
        res.status(err.statusCode).json({ error: err.message });
    }
};

const getCategory = async (req, res) => {
    try {
        const category = await categoryService.getCategoryById(req.params.id);
        res.json(presentCategory(category));
    } catch (err) {
        res.status(err.statusCode).json({ error: err.message });
    }
};

const updateCategory = async (req, res) => {
    try {
        await categoryService.updateCategory(req.params.id, req.body);
        res.status(204).end();
    } catch (err) {
        res.status(err.statusCode).json({ error: err.message });
    }
};

const deleteCategory = async (req, res) => {
    try {
        await categoryService.deleteCategory(req.params.id);
        res.status(204).end();
    } catch (err) {
        res.status(err.statusCode).json({ error: err.message });
    }
};

module.exports = { createCategory, getCategories, getCategory, updateCategory, deleteCategory };