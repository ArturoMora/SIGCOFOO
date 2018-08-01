namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class bita : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.BitacoraSolicitudes",
                c => new
                    {
                        BitacoraSolicitudesId = c.Int(nullable: false, identity: true),
                        SolicitudId = c.Int(nullable: false),
                        FechaMovimiento = c.DateTime(nullable: false),
                        ClavePersona = c.String(),
                        Descripcion = c.String(),
                        EstadoFlujoId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.BitacoraSolicitudesId)
                .ForeignKey("GEN.cat_EstadoFlujo", t => t.EstadoFlujoId, cascadeDelete: true)
                .Index(t => t.EstadoFlujoId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.BitacoraSolicitudes", "EstadoFlujoId", "GEN.cat_EstadoFlujo");
            DropIndex("dbo.BitacoraSolicitudes", new[] { "EstadoFlujoId" });
            DropTable("dbo.BitacoraSolicitudes");
        }
    }
}
