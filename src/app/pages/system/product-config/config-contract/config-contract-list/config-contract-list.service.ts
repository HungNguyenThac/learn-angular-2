import { Injectable } from '@angular/core';
import { ContractTemplateControllerService as DashboardContractTemplateControllerService } from '../../../../../../../open-api-modules/dashboard-api-docs';
import { QUERY_CONDITION_TYPE } from '../../../../../core/common/enum/operator';
import * as _ from 'lodash';
import {
  ContractTemplatesService,
  CreateContractDto,
  UpdateContractDto,
} from '../../../../../../../open-api-modules/monexcore-api-docs';

@Injectable({
  providedIn: 'root',
})
export class ConfigContractListService {
  constructor(
    private dashboardContractTemplateControllerService: DashboardContractTemplateControllerService,
    private monexCoreContractTemplateControllerService: ContractTemplatesService
  ) {}

  public getData(params) {
    let requestBody = this._buildRequestBodyGetList(params);

    return this.dashboardContractTemplateControllerService.getContractTemplates(
      params.limit,
      params.pageIndex,
      requestBody,
      params.orderBy,
      params.sortDirection === 'desc'
    );
  }

  private _buildRequestBodyGetList(params) {
    let requestBody = {};

    if (params.filterConditions) {
      for (const [paramName, paramValue] of Object.entries(
        params.filterConditions
      )) {
        if (!_.isEmpty(params[paramName])) {
          requestBody[paramName + paramValue] = params[paramName] || '';
        }
      }
    }

    if (params.startTime || params.endTime) {
      requestBody['createAt' + QUERY_CONDITION_TYPE.BETWEEN] = {
        start: params.startTime,
        end: params.endTime,
      };
    }

    if (params.keyword) {
      requestBody['name' + QUERY_CONDITION_TYPE.LIKE_KEYWORD] = params.keyword;
    }

    console.log('requestBody----', requestBody);
    console.log('params----', params);
    return requestBody;
  }

  public createContractTemplate(createContractDto: CreateContractDto) {
    return this.monexCoreContractTemplateControllerService.contractTemplateControllerCreateContract(
      createContractDto
    );
  }

  public deleteContractTemplate(id: any) {
    return this.monexCoreContractTemplateControllerService.contractTemplateControllerDownloadContract(
      id,
      null
    );
  }

  public updateContractTemplate(id: any, updateContractDto: UpdateContractDto) {
    return this.monexCoreContractTemplateControllerService.contractTemplateControllerUpdateContract(
      id,
      updateContractDto
    );
  }

  public getDataPropertiesContract(params) {
    return this.dashboardContractTemplateControllerService.getContractTemplates(
      params.limit,
      params.pageIndex,
      {},
      'createdAt',
      true
    );
  }
}
