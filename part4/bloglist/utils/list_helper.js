const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs?.length // check if the array blogs exists and has a length greater than zero, 
                        // if it isn't defined or has a length of zero, the function returns 0.

                    // totalSum is the accumulated total of likes starting on 0.
                    // currentBlog is the current blog post being processed inthe blogs array.
                    // The callback function adds the number of likes for the current blog post 
                    //(currentBlog.likes) to the accumulated total (totalSum), and returns the updated total.
    ? blogs.reduce((totalSum, currentBlog) => totalSum + currentBlog.likes, 0)
    : 0 
}

const favoriteBlog = (blogs) => {
    //The function starts by checking if the blogs array exists and has a length greater than zero
    // (if (!blogs?.length) return {}). If the blogs array is not defined or has a length of zero, 
    //the function returns an empty object {}.
    if (!blogs?.length) return {}

    //the blog objects are expected to have properties title, author and likes.
    const { title, author, likes } = blogs.reduce(

        // favoriteBlog is the current blog with more likes.
        // currentBlog is the current blog being processed in the blogs array.

                                        // The callback function compares the number of likes of the current top blog (favoriteBlog.likes) 
                                        // with the number of likes of the current blog (currentBlog.likes). If the current favorite blog has more likes, 
                                        // the function returns the current top blog (favoriteBlog), otherwise it returns the current blog (currentBlog).
        (favoriteBlog, currentBlog) => favoriteBlog.likes > currentBlog.likes ? favoriteBlog : currentBlog
    )
    /*
    The reduce() method iterates over the blogs array and applies the callback function to each element in the array, 
    updating the favorite blog after each iteration. The final favorite blog is then destructured to extract its title, author, 
    and likes properties. The function returns an object containing these properties as the result of the favoriteBlog function.
    */
    return { title, author, likes }
    
}


module.exports = {
dummy,
totalLikes,
favoriteBlog
}