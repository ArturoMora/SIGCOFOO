namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migraMovimiento3 : DbMigration
    {
        public override void Up()
        {
            AddColumn("GEN.tab_MovimientoCategoria", "CategoriaReal", c => c.String());
            AddColumn("GEN.tab_MovimientoCategoria", "CategoriaAsignada", c => c.String());
            DropColumn("GEN.tab_MovimientoCategoria", "Categoria");
        }
        
        public override void Down()
        {
            AddColumn("GEN.tab_MovimientoCategoria", "Categoria", c => c.String());
            DropColumn("GEN.tab_MovimientoCategoria", "CategoriaAsignada");
            DropColumn("GEN.tab_MovimientoCategoria", "CategoriaReal");
        }
    }
}
