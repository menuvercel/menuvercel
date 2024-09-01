import { useState } from "react"
import { Card, CardContent } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog"
import { PlusIcon, Pencil, Trash2 } from "lucide-react"

export default function Component({ 
  sections, 
  items, 
  onAddSection, 
  onUpdateSection, 
  onDeleteSection, 
  onAddItem, 
  onUpdateItem, 
  onDeleteItem 
}) {
  const [selectedSection, setSelectedSection] = useState(null)
  const [editingSection, setEditingSection] = useState(null)
  const [editingItem, setEditingItem] = useState(null)

  const handleAddSection = () => {
    const newSection = {
      name: "Nueva Sección",
      image: "/placeholder.svg?height=200&width=200"
    }
    onAddSection(newSection)
  }

  const handleUpdateSection = () => {
    onUpdateSection(editingSection)
    setEditingSection(null)
  }

  const handleAddItem = () => {
    const newItem = {
      section_id: selectedSection.id,
      name: "Nuevo Item",
      price: "$0.00",
      image: "/placeholder.svg?height=80&width=80",
      description: "Descripción del nuevo item"
    }
    onAddItem(selectedSection.id, newItem)
  }

  const handleUpdateItem = () => {
    onUpdateItem(editingItem)
    setEditingItem(null)
  }

  return (
    <div className="p-4 space-y-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-6">Panel de Administración</h1>
      
      {!selectedSection && (
        <>
          <div className="space-y-4">
            {sections.map((section) => (
              <Card key={section.id} className="overflow-hidden">
                <CardContent className="p-4 flex justify-between items-center">
                  <h2 className="text-lg font-semibold">{section.name}</h2>
                  <div className="space-x-2">
                    <Button variant="outline" onClick={() => setEditingSection(section)}>
                      <Pencil className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                    <Button variant="destructive" onClick={() => onDeleteSection(section.id)}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Eliminar
                    </Button>
                    <Button variant="default" onClick={() => setSelectedSection(section)}>
                      Entrar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Button onClick={handleAddSection} className="w-full mt-4">
            <PlusIcon className="w-4 h-4 mr-2" />
            Agregar Sección
          </Button>
        </>
      )}

      {selectedSection && (
        <>
          <Button onClick={() => setSelectedSection(null)} className="mb-4">
            Volver a Secciones
          </Button>
          <h2 className="text-xl font-bold mb-4">{selectedSection.name} - Ofertas</h2>
          <div className="space-y-4">
            {items[selectedSection.id]?.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.price}</p>
                  </div>
                  <div className="space-x-2">
                    <Button variant="outline" onClick={() => setEditingItem(item)}>
                      <Pencil className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                    <Button variant="destructive" onClick={() => onDeleteItem(item.id, selectedSection.id)}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Eliminar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Button onClick={handleAddItem} className="w-full mt-4">
            <PlusIcon className="w-4 h-4 mr-2" />
            Agregar Oferta
          </Button>
        </>
      )}

      <Dialog open={editingSection !== null} onOpenChange={() => setEditingSection(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Sección</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Nombre de la sección"
              value={editingSection?.name || ""}
              onChange={(e) => setEditingSection({ ...editingSection, name: e.target.value })}
            />
            <Input
              placeholder="URL de la imagen"
              value={editingSection?.image || ""}
              onChange={(e) => setEditingSection({ ...editingSection, image: e.target.value })}
            />
            <Button onClick={handleUpdateSection}>Guardar Cambios</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={editingItem !== null} onOpenChange={() => setEditingItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Oferta</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Nombre del item"
              value={editingItem?.name || ""}
              onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
            />
            <Input
              placeholder="Precio"
              value={editingItem?.price || ""}
              onChange={(e) => setEditingItem({ ...editingItem, price: e.target.value })}
            />
            <Input
              placeholder="URL de la imagen"
              value={editingItem?.image || ""}
              onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
            />
            <Textarea
              placeholder="Descripción"
              value={editingItem?.description || ""}
              onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
            />
            <Button onClick={handleUpdateItem}>Guardar Cambios</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}