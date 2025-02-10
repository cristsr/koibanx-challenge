import 'reflect-metadata';
import {Param, Body, Get, Post, Put, Delete, JsonController} from 'routing-controllers';
import {UserService} from "./user.service";
import {Service} from "typedi";

@Service()
@JsonController()
export class UserController {
    constructor(public userService: UserService) {}

    @Get('/users')
    getAll() {
        return this.userService.getUsers()
    }

    @Get('/users/:id')
    getOne(@Param('id') id: number) {
        return 'This action returns user #' + id;
    }

    @Post('/users')
    post(@Body() user: any) {
        return 'Saving user...';
    }

    @Put('/users/:id')
    put(@Param('id') id: number, @Body() user: any) {
        return 'Updating a user...';
    }

    @Delete('/users/:id')
    remove(@Param('id') id: number) {
        return 'Removing user...';
    }
}
