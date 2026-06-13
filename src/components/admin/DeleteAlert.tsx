"use client";

import { Button } from "@/components/ui/button";
import {
	AlertDialog,
	AlertDialogTrigger,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogAction,
	AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

interface DeleteAlertProps {
	productTitle: string;
	onDelete?: () => Promise<unknown> | unknown;
}

export function DeleteAlert({ productTitle, onDelete }: DeleteAlertProps) {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button size="sm" variant="destructive">
					<Trash2 />
					<span className="sr-only sm:not-sr-only sm:ml-1">Eliminar</span>
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Eliminar Producto</AlertDialogTitle>
					<AlertDialogDescription>
						¿Estás seguro que deseas eliminar el producto &quot;{productTitle}
						&quot;? Esta acción es irreversible.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancelar</AlertDialogCancel>
					<AlertDialogAction onClick={onDelete}>
						Confirmar
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
