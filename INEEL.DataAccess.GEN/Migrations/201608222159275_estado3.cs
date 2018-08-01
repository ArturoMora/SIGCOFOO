namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class estado3 : DbMigration
    {
        public override void Up()
        {
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
            
        }
        
        public override void Down()
        {
            DropTable("GEN.cat_EstadoFlujo");
        }
    }
}
