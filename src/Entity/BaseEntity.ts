import { v4 as uuidv4 } from "uuid";

// BaseEntity Class
abstract class BaseEntity {
	id!: string;
	uId!: string;
	createdOn!: string;
	createdOnTs!: number;
	updatedBy!: string;
	updatedByName!: string;
	updatedOn!: string;
	updatedOnTs!: number;
	version!: number;
	active!: boolean;
	archived!: boolean;

	// Initialize function to set the  values
	initialize(isNew: boolean, createdOrUpdatedBy: string, createdOrUpdatedByName: string): void {
		this.id = uuidv4();
		this.active = true;
		this.archived = false;

		let date = new Date();
		if (isNew) {
			this.uId = this.id;
			this.createdOn = date.toISOString();
			this.createdOnTs = date.getTime();
			this.version = 1;
			this.updatedBy = createdOrUpdatedBy;
			this.updatedByName = createdOrUpdatedByName;
			this.updatedOn = date.toISOString();
		} else {
			this.updatedBy = createdOrUpdatedBy;
			this.updatedByName = createdOrUpdatedByName;
			this.updatedOn = date.toISOString();
			this.updatedOnTs = date.getTime();
			this.version++;
		}
	}
}

function initialize<T extends BaseEntity>(isNew: boolean, createdOrUpdatedBy: string, createdOrUpdatedByName: string, source: T): T {
	source.id = uuidv4();
	source.active = true;
	source.archived = false;

	let date = new Date();
	if (isNew) {
		source.uId = source.id;
		source.createdOn = date.toISOString();
		source.createdOnTs = date.getTime();
		source.updatedBy = createdOrUpdatedBy;
		source.updatedByName = createdOrUpdatedByName;
		source.updatedOn = date.toISOString();
		source.updatedOnTs = date.getTime();
	} else {
		source.updatedBy = createdOrUpdatedBy;
		source.updatedByName = createdOrUpdatedByName;
		source.updatedOn = date.toISOString();
		source.updatedOnTs = date.getTime();
		source.version++;
	}
	return source;
}
export { initialize, BaseEntity };
