const Category = require('../models/category');
const Movie = require('../models/movie');
const errorClass = require("../ErrorHandling");

const getById = async (id) => {
    try {
        const category = await Category.findById(id);
        if (!category) throw { statusCode: 404, message: 'Category not found' };
        return category;
    } catch (err) {
        errorClass.filterError(err);
    }
}

const getCategoryIdByName = async (name) => {
    try {
        const category = await Category.findOne({ name });
        if (!category) throw { statusCode: 404, message: 'Category not found' };
        return category._id;
    } catch (err) {
        errorClass.filterError(err);
    }
}

const createCategory = async (name, promoted) => {
    try {
        const category = new Category({ name , promoted });
        return (await category.save())._id;
    } catch (err) {
        errorClass.filterError(err);
    }
};

const getCategoryById = async (id) => {
    try {
        return await getById(id);
    } catch (err) {
        errorClass.filterError(err);
    }
};

const getCategories = async () => {
    try {
        return await Category.find({});
    } catch (err) {
        errorClass.filterError(err); 
    }
};

const updateCategory = async (id, body) => {
    try {
        const category = await getById(id);
        category.set(body);
        await category.save();
    } catch (err) {
        errorClass.filterError(err);
    }
};

const deleteCategory = async (id) => {
    try {
        const category = await getById(id);
        
        // Remove the category from the movies
        await Movie.updateMany(
            { categories: id }, // Find the movies that have this category
            { $pull: { categories: id } } // Remove them
        );

        await category.deleteOne();
    } catch (err) {
        errorClass.filterError(err);
    }
};

module.exports = { createCategory, getCategoryById, getCategories, updateCategory, deleteCategory, getCategoryIdByName};