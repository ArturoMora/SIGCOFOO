namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class PersonalProyecto2 : DbMigration
    {
        public override void Up()
        {
            //MoveTable(name: "GEN.Iniciativas", newSchema: "dbo");
            //MoveTable(name: "GEN.Propuestas", newSchema: "dbo");
            CreateTable(
                "GEN.cat_EstadoFlujo",
                c => new
                    {
                        EstadoFlujoId = c.Int(nullable: false, identity: true),
                        FechaEfectiva = c.DateTime(nullable: false),
                        Descripcion = c.String(maxLength: 200),
                        DescripcionCorta = c.String(maxLength: 50),
                        Estado = c.Int(),
                    })
                .PrimaryKey(t => t.EstadoFlujoId);

            //AddColumn("GEN.PersonalProyecto", "FechaValidacion", c => c.DateTime());
            //AddColumn("GEN.PersonalProyecto", "EstadoFlujoId", c => c.Int(nullable: false));
            ////AddColumn("GEN.PersonalProyecto", "FechaInicio", c => c.DateTime(nullable: false));
            ////AddColumn("GEN.PersonalProyecto", "FechaTermino", c => c.DateTime(nullable: false));
            ////AddColumn("GEN.PersonalProyecto", "Participacion", c => c.String());
            ////AddColumn("GEN.PersonalProyecto", "DescripcionActividades", c => c.String(maxLength: 300));
            ////AddColumn("GEN.PersonalProyecto", "AdjuntoId", c => c.Long());
            //CreateIndex("GEN.PersonalProyecto", "EstadoFlujoId");
            ////CreateIndex("GEN.PersonalProyecto", "AdjuntoId");
            ////AddForeignKey("GEN.PersonalProyecto", "AdjuntoId", "GEN.Adjunto", "AdjuntoId");
            //AddForeignKey("GEN.PersonalProyecto", "EstadoFlujoId", "GEN.cat_EstadoFlujo", "EstadoFlujoId", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("GEN.PersonalProyecto", "EstadoFlujoId", "GEN.cat_EstadoFlujo");
            DropForeignKey("GEN.PersonalProyecto", "AdjuntoId", "GEN.Adjunto");
            DropIndex("GEN.PersonalProyecto", new[] { "AdjuntoId" });
            DropIndex("GEN.PersonalProyecto", new[] { "EstadoFlujoId" });
            DropColumn("GEN.PersonalProyecto", "AdjuntoId");
            DropColumn("GEN.PersonalProyecto", "DescripcionActividades");
            DropColumn("GEN.PersonalProyecto", "Participacion");
            DropColumn("GEN.PersonalProyecto", "FechaTermino");
            DropColumn("GEN.PersonalProyecto", "FechaInicio");
            DropColumn("GEN.PersonalProyecto", "EstadoFlujoId");
            DropColumn("GEN.PersonalProyecto", "FechaValidacion");
            DropTable("GEN.cat_EstadoFlujo");
            MoveTable(name: "dbo.Propuestas", newSchema: "GEN");
            MoveTable(name: "dbo.Iniciativas", newSchema: "GEN");
        }
    }
}
