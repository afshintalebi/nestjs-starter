import { Test, TestingModule } from "@nestjs/testing";
import { UserAdminService } from "./user-admin.service";
import { getUserModuleTestConfigs } from "@/../test/test-utils";

describe('UserAdminService', () => {
    let service: UserAdminService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule(
          getUserModuleTestConfigs(),
        ).compile();
    
        service = module.get<UserAdminService>(UserAdminService);
      });

      it('should be defined', () => {
        expect(service).toBeDefined();
      });
})