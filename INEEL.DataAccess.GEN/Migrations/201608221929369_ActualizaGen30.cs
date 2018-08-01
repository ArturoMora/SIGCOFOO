namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ActualizaGen30 : DbMigration
    {
        public override void Up()
        {
            MoveTable(name: "dbo.Iniciativas", newSchema: "GEN");
            MoveTable(name: "dbo.Propuestas", newSchema: "GEN");

            /*
            DropForeignKey("GEN.PersonalProyecto", "AdjuntoId", "GEN.Adjunto");
            DropIndex("GEN.PersonalProyecto", new[] { "AdjuntoId" });
            DropColumn("GEN.PersonalProyecto", "FechaInicio");
            DropColumn("GEN.PersonalProyecto", "FechaTermino");
            DropColumn("GEN.PersonalProyecto", "Participacion");
            DropColumn("GEN.PersonalProyecto", "DescripcionActividades");
            DropColumn("GEN.PersonalProyecto", "AdjuntoId");
            */
        }
        
        public override void Down()
        {
            /*
            AddColumn("GEN.PersonalProyecto", "AdjuntoId", c => c.Long());
            AddColumn("GEN.PersonalProyecto", "DescripcionActividades", c => c.String(maxLength: 300));
            AddColumn("GEN.PersonalProyecto", "Participacion", c => c.String());
            AddColumn("GEN.PersonalProyecto", "FechaTermino", c => c.DateTime(nullable: false));
            AddColumn("GEN.PersonalProyecto", "FechaInicio", c => c.DateTime(nullable: false));
            CreateIndex("GEN.PersonalProyecto", "AdjuntoId");
            AddForeignKey("GEN.PersonalProyecto", "AdjuntoId", "GEN.Adjunto", "AdjuntoId");
            */
            MoveTable(name: "GEN.Propuestas", newSchema: "dbo");
            MoveTable(name: "GEN.Iniciativas", newSchema: "dbo");
        }
    }
}
