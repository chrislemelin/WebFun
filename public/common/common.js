/// graphics helper functions
function tween(num1, num2, ratio)
{
    var difference = num2 - num1;
    return (ratio * difference) + num1;
}
