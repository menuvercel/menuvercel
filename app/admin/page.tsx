"use client"

import { useState, useEffect } from "react"
import { Button } from "../components/ui/button"
import AdminPanel from "../components/AdminPanel"
import { useRouter } from "next/navigation"

// Definimos las interfaces para nuestras estructuras de datos
interface Section {
  id?: number;
  name: string;
  image: string;
}

interface Item {
  id?: number;
  section_id: number;
  name: string;
  price: string;
  image: string;
  description: string;
}

export default function AdminPage() {
  const [sections, setSections] = useState<Section[]>([])
  const [items, setItems] = useState<Record<number, Item[]>>({})
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchMenuData()
  }, [])

  const fetchMenuData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/menu')
      const data = await response.json()
      setSections(data.sections)
      setItems(data.items)
    } catch (error) {
      console.error('Error fetching menu data:', error)
    }
    setIsLoading(false)
  }

  const handleAddSection = async (newSection: Section) => {
    try {
      const response = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'section', data: newSection }),
      })
      const addedSection = await response.json()
      setSections([...sections, addedSection])
      setItems({ ...items, [addedSection.id]: [] })
    } catch (error) {
      console.error('Error adding section:', error)
    }
  }

  const handleUpdateSection = async (updatedSection: Section) => {
    try {
      const response = await fetch('/api/menu', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'section', id: updatedSection.id, data: updatedSection }),
      })
      const updated = await response.json()
      setSections(sections.map(s => s.id === updated.id ? updated : s))
    } catch (error) {
      console.error('Error updating section:', error)
    }
  }

  const handleDeleteSection = async (sectionId: number) => {
    try {
      await fetch('/api/menu', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'section', id: sectionId }),
      })
      setSections(sections.filter(s => s.id !== sectionId))
      const newItems = { ...items }
      delete newItems[sectionId]
      setItems(newItems)
    } catch (error) {
      console.error('Error deleting section:', error)
    }
  }

  const handleAddItem = async (sectionId: number, newItem: Item) => {
    try {
      const response = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'item', data: newItem }),
      })
      const addedItem = await response.json()
      setItems(prevItems => ({
        ...prevItems,
        [sectionId]: [...(prevItems[sectionId] || []), addedItem]
      }))
    } catch (error) {
      console.error('Error adding item:', error)
    }
  }

  const handleUpdateItem = async (updatedItem: Item) => {
    try {
      const response = await fetch('/api/menu', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'item', id: updatedItem.id, data: updatedItem }),
      })
      const updated = await response.json()
      setItems(prevItems => ({
        ...prevItems,
        [updated.section_id]: prevItems[updated.section_id].map(i => i.id === updated.id ? updated : i)
      }))
    } catch (error) {
      console.error('Error updating item:', error)
    }
  }

  const handleDeleteItem = async (itemId: number, sectionId: number) => {
    try {
      await fetch('/api/menu', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'item', id: itemId }),
      })
      setItems(prevItems => ({
        ...prevItems,
        [sectionId]: prevItems[sectionId].filter(i => i.id !== itemId)
      }))
    } catch (error) {
      console.error('Error deleting item:', error)
    }
  }

  if (isLoading) {
    return <div className="p-4 text-center">Cargando...</div>
  }

  return (
    <AdminPanel
      sections={sections}
      items={items}
      onAddSection={handleAddSection}
      onUpdateSection={handleUpdateSection}
      onDeleteSection={handleDeleteSection}
      onAddItem={handleAddItem}
      onUpdateItem={handleUpdateItem}
      onDeleteItem={handleDeleteItem}
    />
  )
}