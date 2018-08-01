namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class EdadPromedioHistorico : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "GEN.tab_EdadPromedioHistorico",
                c => new
                    {
                        year = c.String(nullable: false, maxLength: 128),
                        edadpromedio = c.Decimal(nullable: false, precision: 18, scale: 2),
                    })
                .PrimaryKey(t => t.year);
            
        }
        
        public override void Down()
        {
            DropTable("GEN.tab_EdadPromedioHistorico");
        }
    }
}
