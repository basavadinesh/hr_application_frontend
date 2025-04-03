export function convertSlugToUrl(slug, parameters) {
    let url = slug;
    Object.entries(parameters).forEach(([key, value]) => {
        url = url.replace(`:${key}`, value);
    });
    console.log('url', url);
    console.log('slug', slug);
    console.log('parameters', parameters)
    return url;
}
