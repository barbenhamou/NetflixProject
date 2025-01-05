const Category = require('../models/category');
const errorClass = require("../ErrorHandling");

const displayedCategory = (category) => {
    return {
        id: category._id,
        title: category.title,
        promoted: category.promoted
    };
};

const getById = async (id) => {
    try {
        const category = await Category.findById(id);
        if (!category) throw { statusCode: 404, message: 'Category not found' };
    } catch (error) {
        errorClass.errorCatch(error);
    }
}

const getIdByName = async (title) => {
    try {
        const category = await Category.findOne({title : title});
        if (!category) throw { statusCode: 404, message: 'Category not found' };
    } catch (error) {
        errorClass.errorCatch(error);
    }
}

const createCategory = async (title, promoted) => {
    try {
        const category = new Category({ title , promoted});
        return (await category.save())._id;
    } catch (error) {
        errorClass.errorCatch(error);
    }
};

const getCategoryById = async (id) => {
    try {
        return displayedCategory(getById(id));
    } catch (error) {
        errorClass.errorCatch(error);
    }
};

const getCategories = async () => {
    try {
        return (await Category.find({})).map(category => displayedCategory(category));
    } catch (error) {
        errorClass.errorCatch(error);
    }
};

const updateCategory = async (id, title) => {
    try {
        const category = await getById(id);
        category.title = title;
        await category.save();
    } catch (error) {
        errorClass.errorCatch(error);
    }
};

const deleteCategory = async (id) => {
    try {
        const category = await getById(id);
        await category.deleteOne();
    } catch (error) {
        errorClass.errorCatch(error);
    }
};

module.exports = { createCategory, getCategoryById, getCategories, updateCategory, deleteCategory, getIdByName};