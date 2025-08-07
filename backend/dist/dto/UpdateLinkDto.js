"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateLinkDto = void 0;
const class_validator_1 = require("class-validator");
class UpdateLinkDto {
}
exports.UpdateLinkDto = UpdateLinkDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)({}, { message: 'Geçerli bir URL giriniz.' }),
    __metadata("design:type", String)
], UpdateLinkDto.prototype, "original_url", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Short code metin olmalıdır.' }),
    __metadata("design:type", String)
], UpdateLinkDto.prototype, "short_code", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'Tarih formatı geçersiz. (örnek: 2025-12-31T12:00)' }),
    __metadata("design:type", Object)
], UpdateLinkDto.prototype, "expires_at", void 0);
