import { k8sApi } from "./config.js";

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
					port: 80,
					targetPort: 3000,
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
