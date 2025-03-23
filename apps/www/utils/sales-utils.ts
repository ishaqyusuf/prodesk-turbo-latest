export const salesFormUrl = (type, slug?) => {
    return `/sales-book/${slug ? `edit-${type}` : `create-${type}`}${
        slug ? `/${slug}` : ""
    }`;
};
