const snippets = {
csharp: `using System;

namespace Program
{
    public class Hello
    {
        static void Main() 
        {
            Console.WriteLine("Hello World!");
        }
    }
}`,
python: `print('Hello World!');`,
javascript: `console.log('Hello World!');`,
typescript: `let x:number;
x= 7;
console.log(x);
console.log('Hello World!');`,
    html: `<!DOCTYPE html>
<html>
<body>
    <h1>Hello World!</h1>
</body>
</html>`
};

export default snippets;