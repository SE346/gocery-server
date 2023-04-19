// ! Defind component

/**
 * @swagger
 * components:
 *   schemas:
 *     UserRegister:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - lastName
 *         - firstName
 *         - phoneNum
 *       properties:
 *         email:
 *           type: string
 *           description: The email of user
 *         password:
 *           type: string
 *           description: The password of user
 *         lastName:
 *           type: string
 *           description: The last name of user
 *         firstName:
 *           type: string
 *           description: The first name of user
 *         phoneNum:
 *           type: string
 *           description: The phone number of user
 *       example:
 *         email: 20522122@gm.uit.edu.vn
 *         password: tuannt02
 *         lastName: Tuấn
 *         firstName: Nguyễn
 *         phoneNum: "0967781796"
 *     UserLogin:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: The email of user
 *         password:
 *           type: string
 *           description: The password of user
 *       example:
 *         email: 20522122@gm.uit.edu.vn
 *         password: tuannt02
 *   requestBodies:
 *     UserRegister:
 *       description: UserRegister object that needs to be added the system
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegister'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - title
 *         - author
 *         - finished
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the book
 *         title:
 *           type: string
 *           description: The title of your book
 *         author:
 *           type: string
 *           description: The book author
 *         finished:
 *           type: boolean
 *           description: Whether you have finished reading the book
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The date the book was added
 *       example:
 *         id: d5fE_asz
 *         title: The New Turing Omnibus
 *         author: Alexander K. Dewdney
 *         finished: false
 *         createdAt: 2020-03-10T04:05:06.157Z
 */
