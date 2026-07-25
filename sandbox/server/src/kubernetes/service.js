import { k8sApi } from "./config";

export async function createService(sandboxId) {
	const serviceManifest = {
		apiVersion: "v1",
		kind: "Service",
		metadata: {
			name: `sandbox-service-${sandboxId}`,
			labels: {
				app: `sandbox-${sandboxId}`,
			},
		},
		spec: {
			selector: {
				app: `sandbox-${sandboxId}`,
			},
			ports: [
				{
					protocol: "TCP",
					port: 3000,
					targetPort: 5173,
				},
			],
			type: "ClusterIP",
		},
	};

	try {
		const response = await k8sApi.createNamespacedService("default", serviceManifest);
		console.log(`Service created: ${response.body.metadata.name}`);
	} catch (error) {
		console.error("Error creating service:", error);
	}
}
