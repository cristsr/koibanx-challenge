import 'reflect-metadata';
import {Param, Get, Post, Delete, JsonController, UploadedFile, Patch, Body, QueryParam} from 'routing-controllers';
import {Service} from "typedi";
import {TaskService} from "../services";
import {Express} from "express";
import {upload} from "../../config";
import {TaskFormat} from "../dto";

@Service()
@JsonController('/tasks')
export class TaskController {
    constructor(public taskService: TaskService) {}

    @Post('/upload')
    upload(@UploadedFile('file', { options: upload }) file: Express.Multer.File) {
        return this.taskService.startTask(file,);
    }

    @Get('/')
    getTasks() {
        return this.taskService.getTasks()
    }

    @Get('/:taskId/formats')
    getFormats(@Param('taskId') taskId: string) {
        return this.taskService.getFormats(taskId);
    }

    @Get('/:taskId/formats/:formatId/status')
    getStatus(@Param('taskId') taskId: string, @Param('formatId') formatId: string) {
        return this.taskService.getStatus(taskId, formatId);
    }

    @Patch('/:taskId/formats')
    addFormat(@Param('taskId') taskId: string, @Body() format: TaskFormat) {
        return this.taskService.addFormat(taskId, format);
    }

    @Get('/:taskId/formats/:formatId/data')
    getData(
        @Param('taskId') taskId: string,
        @Param('formatId') formatId: string,
        @QueryParam('page') page: number,
        @QueryParam('limit') limit: number,
    ) {
        return this.taskService.getData(taskId, formatId, page, limit);
    }
}
