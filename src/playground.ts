import {db} from "./server/db";

await db.user.create({
    data:{
        emailAddress:'abc@gmail.com',
        firstName:'John',
        lastName:'Doe',
        imageUrl: "https://example.com/image.jpg",
    }
})

console.log('done')