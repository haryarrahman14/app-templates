import { PageContainer, PageHeader } from "@/components/kit/page-header";
import { DocCollection } from "@/features/documents/components/doc-collection";

export function SharedPage() {
	return (
		<PageContainer className="space-y-8">
			<PageHeader
				title="Shared with me"
				description="Documents your teammates own and have shared with you."
			/>
			<DocCollection scope="shared" />
		</PageContainer>
	);
}
