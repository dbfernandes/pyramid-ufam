export function getConcludedHours(total: number) {
	return total === 1 ? "hora concluída" : "horas concluídas";
}

export function getPendingLabel(total: number) {
	return total === 1 ? "submissão pendente" : "submissões pendentes";
}

export function getRejectedLabel(total: number) {
	return total === 1 ? "submissão rejeitada" : "submissões rejeitadas";
}

export function getPreApprovedLabel(total: number) {
	return total === 1 ? "submissão pré-aprovada" : "submissões pré-aprovadas";
}

export function getApprovedLabel(total: number) {
	return total === 1 ? "submissão aprovada" : "submissões aprovadas";
}

export function getStudentsLabel(total: number) {
	return total === 1 ? "aluno no curso" : "alunos no curso";
}
