namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class articuloyponenciaproyectonota : DbMigration
    {
        public override void Up()
        {
            AddColumn("CH.tab_Ponencia", "ProyectoId", c => c.String(maxLength: 10));
            AddColumn("CH.tab_Ponencia", "nota", c => c.String());
            AddColumn("CH.tab_Publicacion", "ProyectoId", c => c.String(maxLength: 10));
            AddColumn("CH.tab_Publicacion", "nota", c => c.String());
            CreateIndex("CH.tab_Ponencia", "ProyectoId");
            CreateIndex("CH.tab_Publicacion", "ProyectoId");
            AddForeignKey("CH.tab_Ponencia", "ProyectoId", "GEN.Proyectos", "ProyectoId");
            AddForeignKey("CH.tab_Publicacion", "ProyectoId", "GEN.Proyectos", "ProyectoId");
        }
        
        public override void Down()
        {
            DropForeignKey("CH.tab_Publicacion", "ProyectoId", "GEN.Proyectos");
            DropForeignKey("CH.tab_Ponencia", "ProyectoId", "GEN.Proyectos");
            DropIndex("CH.tab_Publicacion", new[] { "ProyectoId" });
            DropIndex("CH.tab_Ponencia", new[] { "ProyectoId" });
            DropColumn("CH.tab_Publicacion", "nota");
            DropColumn("CH.tab_Publicacion", "ProyectoId");
            DropColumn("CH.tab_Ponencia", "nota");
            DropColumn("CH.tab_Ponencia", "ProyectoId");
        }
    }
}
