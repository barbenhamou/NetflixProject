const categoryService = require('../services/category');

const createCategory = async (req, res) => {
    try {
        const categoryId = await categoryService.createCategory(req.body.title, req.body.promoted);
        res.status(201).set('Location', `/api/categories/${categoryId}`);
    } catch (error) {
        res.status(error.statusCode).json({ error: error.message });
    }
};

const getCategories = async (req, res) => {
    try {
        const categories = await categoryService.getCategories();
        res.json(categories);
    } catch (error) {
        res.status(error.statusCode).json({ error: error.message });
    }
};

const getCategory = async (req, res) => {
    try {
        const category = await categoryService.getCategoryById(req.params.id);
        res.json(category);
    } catch (error) {
        res.status(error.statusCode).json({ error: error.message });
    }
};

const updateCategory = async (req, res) => {
    try {
        await categoryService.updateCategory(req.params.id, req.body.title);
    } catch (error) {
        res.status(error.statusCode).json({ error: error.message });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const category = await categoryService.deleteCategory(req.params.id);
        if (!category) {
            return res.status(404).json({ errors: ['Category not found'] });
        }
        res.json({ message: 'Category deleted', category });
    } catch (error) {
        res.status(error.statusCode).json({ error: error.message });
    }
};

module.exports = { createCategory, getCategories, getCategory, updateCategory, deleteCategory };